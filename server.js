require('dotenv').config();
const { WebSocketServer, WebSocket } = require('ws');
const query = require('./scripts/pgdb');

const wss = new WebSocketServer({ port: 4000 });
const rooms = {}; // Object to keep track of room members
const userRooms = {}; // Object to keep track of user rooms
const onlineUsers = new Map(); // Track online users
const userConnections = new Map(); // Track connections per user

function displayStatus (){
  console.log(`rooms`, rooms);
  console.log(`userRooms`, userRooms);
  console.log(`onlineUsers`, onlineUsers);
  console.log(`userConnections`, userConnections);
}

// Read message and mark as read
async function readMessage(messageId) {
  const statement = `UPDATE channel_messages SET read_msg = 'true' WHERE message_id = $1`;
  try {
    await query(statement, [messageId]);
  } catch (error) {
    console.error('Error executing readMessage query:', error);
  }
}

// Get rooms for a user
async function getRooms(userId) {
  const statement = `
    WITH UserChannels AS (
        SELECT channel_id, member_name, member_id
        FROM channel_members 
        WHERE member_id <> $1
        AND channel_id IN (
            SELECT channel_id 
            FROM channel_members 
            WHERE member_id = $1
        )
    ),
    LatestMessages AS (
        SELECT
            channel_id,
            message_text,
            date_created,
            message_id,
            sender_id,
            sender_email,
            read_msg,
            ROW_NUMBER() OVER (PARTITION BY channel_id ORDER BY date_created DESC) AS rn
        FROM
            channel_messages
    )
    SELECT
        uc.channel_id, 
        uc.member_name,
        uc.member_id,
        s.profile_pic_url  AS image,
        lm.message_text,
        lm.date_created,
        lm.message_id,
        lm.sender_id,
        lm.sender_email,
        lm.read_msg
    FROM
        UserChannels uc
    LEFT JOIN
        LatestMessages lm
    ON
        uc.channel_id = lm.channel_id::integer
    AND
        lm.rn = 1
    LEFT JOIN
        students s
    ON
        uc.member_id = s.student_num::text
    ORDER BY
        lm.date_created DESC;

  `;
  try {
    return await query(statement, [userId]);
  } catch (error) {
    console.error('Error executing getRooms query:', error);
    return [];
  }
}

// Join a room
async function joinRoom(ws, channelId, userId) {
  try {
    // Leave previous room if exists
    if (ws.channelId) {
      if (rooms[ws.channelId]) {
        rooms[ws.channelId].delete(ws);
        if (rooms[ws.channelId].size === 0) {
          delete rooms[ws.channelId];
        }
      }
    }

    // Ensure room exists
    if (!rooms[channelId]) {
      rooms[channelId] = new Set();
    }

    // Add client to room
    rooms[channelId].add(ws);
    ws.channelId = channelId;

    // Store user's current room
    // userRooms[userId] = channelId;

    // Store user's current room
    if (!userRooms[userId]) {
      userRooms[userId] = new Set();
    }

    // Load messages for the room
    const messagesQuery = `
    SELECT cm.message_text, cm.date_created, cm.read_msg, cm.message_id,
    cm.sender_id, cm.channel_id, s.student_num, s.firstname, s.lastname, s.profile_pic_url  
    FROM channel_messages cm
    INNER JOIN students s ON cm.sender_id::integer = s.student_num
    WHERE cm.channel_id = $1
    ORDER BY cm.date_created
    `;
    const messages = await query(messagesQuery, [channelId]);

    ws.send(JSON.stringify({ type: 'joined', channel_id: channelId, messages }));

    console.log(`Client joined channel: ${channelId}`);
    displayStatus();

  } catch (error) {
    console.error('Error joining room:', error);
    ws.send(JSON.stringify({ type: 'error', message: 'Failed to join room' }));
  }
}

// Send a message
async function sendMessage(ws, data) {
  try {
    const queryText = `
      INSERT INTO channel_messages (channel_id, sender_id, message_text, sender_email, date_created)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING message_id
    `;
    const result = await query(queryText, [data.channel_id, data.sender_id, data.message_text, data.sender_email, data.date_created]);
    
    const message_id = result[0].message_id;
    data.message_id = message_id;

    // Broadcast message to all clients in the room
    if (rooms[data.channel_id]) {
      rooms[data.channel_id].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', ...data }));
        }
      });
    }

    // Notify online users who are not in the room
    onlineUsers.forEach((isOnline, userId) => {
      if (isOnline && userRooms[userId] !== data.channel_id) {
        if (userConnections.has(userId)) {
          userConnections.get(userId).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ 
                type: 'roomMessage', 
                message_id: data.message_id,
                member_id: data.sender_id,
                channel_id: data.channel_id,
                member_name: `${data.firstname} ${data.lastname}`,
                read_msg: 'false',
                message_text: data.message_text,
                date_created: data.date_created,
                sender_id: data.sender_id,
              }));
            }
          });
        }
      }
    });

    console.log(`Message sent to channel ${data.channel_id}: ${data.message_text}`);
  } catch (error) {
    console.error('Error sending message:', error);
    ws.send(JSON.stringify({ type: 'error', message: 'Failed to send message' }));
  }
}

// Broadcast online status
function broadcastOnlineStatus() {
  const onlineStatus = Array.from(onlineUsers.entries()).map(([userId, isOnline]) => ({
    user_id: userId,
    is_online: isOnline,
  }));
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'onlineStatus', onlineStatus }));
    }
  });
}

// Handle new connection
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'getRooms':
          const userRoomsResult = await getRooms(data.user_id);
          ws.send(JSON.stringify({ type: 'roomsList', rooms: userRoomsResult }));
          break;
        case 'join':
          await joinRoom(ws, data.channel_id, data.user_id);
          break;
        case 'message':
          await sendMessage(ws, data);
          break;
        case 'setOnline':
          onlineUsers.set(data.user_id, true);
          if (!userConnections.has(data.user_id)) {
            userConnections.set(data.user_id, new Set());
          }
          userConnections.get(data.user_id).add(ws);
          broadcastOnlineStatus();
          break;
        case 'readMessage':
          await readMessage(data.message_id);
          break;
        default:
          console.error('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove client from room
    if (ws.channelId && rooms[ws.channelId]) {
      rooms[ws.channelId].delete(ws);
      if (rooms[ws.channelId].size === 0) {
        delete rooms[ws.channelId];
      }
    }

    // Update online status
    userConnections.forEach((connections, userId) => {
      if (connections.has(ws)) {
        connections.delete(ws);
        if (connections.size === 0) {
          onlineUsers.set(userId, false);
          userConnections.delete(userId);
        }
      }
    });

    broadcastOnlineStatus();
  });
});

console.log('WebSocket server running on ws://localhost:4000');
