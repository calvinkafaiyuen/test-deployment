"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button, Avatar, Textarea } from '@nextui-org/react';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React, { memo } from 'react';

interface Message {
    message_id?: string;
    date_created: string;
    sender_id: number;
    firstname: string;
    lastname: string;
    message_text: string;
    profile_pic_url: string;
    read_msg?: string;
}

interface Room {
    member_id: number;
    channel_id: string;
    member_name: string;
    read_msg?: string;
    message_text: string;
    message_id: string;
    date_created: string;
    sender_id: number;
    image: string;
}

const ChatComponent = memo((UserProfile: any) => {
    console.log('userProfile', UserProfile)
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [output, setOutput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [onlineStatuses, setOnlineStatuses] = useState<{ [key: number]: boolean }>({});
    const [showConversations, setShowConversations] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chateeName, setChateeName] = useState('');
    const [chateeImage, setChateeImage] = useState('');
    const [mobileScreen, setMobileScreen] = useState(false);

    //This is to handle responsive UI for chat on smaller devices
    const useResponsiveClasses = () => {
      useEffect(() => {
    
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setMobileScreen(true);
          } else {
            setMobileScreen(false)
          }
        };
        // Initial check
        handleResize();    
        // Add event listener for resize
        window.addEventListener('resize', handleResize);
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    };
    useResponsiveClasses();

    function formatDate(dateString: string) {
        const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    }

    const currentUser = useMemo(() => UserProfile.user[0], [UserProfile]);

    const readMessage = useCallback((message_id: string | number) => {
        const alertElement = document.getElementById(`new-message-alert-messageId-${message_id}`);
        if (alertElement) {
            alertElement.style.display = 'none';
            const message = { type: 'readMessage', message_id: message_id };
            ws?.send(JSON.stringify(message));
        }
    }, [ws]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = '/public/hatchery-logo.png'; // default image
    };

    const renderMessageCard = useCallback((msg: any) => {
        const isCurrentUser = msg.sender_id == currentUser.user_id;
        return (
            <div key={msg.message_id || msg.date_created} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <Card shadow="sm" className={`max-w-[300px] m-2 ${isCurrentUser ? 'bg-blue-100' : ''}`}>
                    <CardHeader className={isCurrentUser ? 'justify-end' : 'justify-between'}>
                        <div className="flex gap-5">
                            {isCurrentUser ? (
                                <>
                                    <div className="flex flex-col items-start justify-center">
                                        <h4 className="text-xs font-semibold leading-none text-gray-900">{msg.firstname} {msg.lastname}</h4>
                                    </div>
                                    <Avatar
                                        radius="full"
                                        size="sm"
                                        className="h-8 w-8 bg-white rounded-full border-solid border-2 border-blue-600"
                                        src={msg.profile_pic_url}
                                        onError={()=>handleAvatarError}
                                    />
                                </>
                            ) : (
                                <>
                                    <Avatar
                                        radius="full"
                                        size="sm"
                                        className="h-8 w-8 bg-white rounded-full border-solid border-2 border-blue-600"
                                        src={msg.profile_pic_url}
                                        onError={()=>handleAvatarError}
                                    />
                                    <div className="flex flex-col items-start justify-center">
                                        <h4 className="text-xs font-semibold leading-none text-gray-900">{msg.firstname} {msg.lastname}</h4>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardHeader>
                    <CardBody className="px-2 py-2 text-xs text-gray-600">
                        <p className={`text-xs text-black ${isCurrentUser ? 'text-right' : 'text-left'}`}>{msg.message_text}</p>
                        <p className={`text-[8px] text-black pt-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{new Date(msg.date_created).toLocaleString()}</p>
                    </CardBody>
                </Card>
            </div>
        );
    }, [currentUser.user_id]);

    const handleGetRooms = useCallback(() => {
        const message = { type: 'getRooms', user_id: currentUser.user_id };
        ws?.send(JSON.stringify(message));
    }, [currentUser.user_id, ws]);

    const handleNewRoomMessage = useCallback((messageData: any) => {
      setRooms((prevRooms:any) => {
          const roomExists = prevRooms.some((room:any) => room.channel_id === messageData.channel_id);
          if (roomExists) {
              return prevRooms.map((room:any) => 
                  room.channel_id === messageData.channel_id 
                      ? { ...room, message_text: messageData.message_text, date_created: messageData.date_created, message_id: messageData.message_id, read_msg: messageData.read_msg } 
                      : room
              );
          } else {
              const newRoom = {
                  member_id: messageData.sender_id,
                  channel_id: messageData.channel_id,
                  member_name: messageData.firstname + ' ' + messageData.lastname,
                  message_text: messageData.message_text,
                  message_id: messageData.message_id,
                  date_created: messageData.date_created,
                  sender_id: messageData.sender_id,
                  read_msg: messageData.read_msg,
              };
              return [...prevRooms, newRoom];
          }
      });
    }, []);

    const updateOnlineStatus = useCallback((onlineStatus: any) => {
      const statusMap = onlineStatus.reduce((acc: { [key: number]: boolean }, status: any) => {
          acc[status.user_id] = status.is_online;
          return acc;
      }, {});
      setOnlineStatuses(statusMap);
    }, []);

    useEffect(() => {
        if (ws) {
            const handleOpen = () => {
                setOutput((prevOutput) => prevOutput + 'Connected to WebSocket server\n');
                const setOnlineMessage = { type: 'setOnline', user_id: currentUser.user_id };
                ws.send(JSON.stringify(setOnlineMessage));
                handleGetRooms();
            };

            const handleMessage = (event: MessageEvent) => {
                const messageData = JSON.parse(event.data);
                switch (messageData.type) {
                    case 'roomsList':
                        setRooms(messageData.rooms);
                        setOutput((prevOutput) => prevOutput + 'Rooms list updated\n');
                        break;
                    case 'joined':
                        setOutput(`Joined room ${messageData.channel_id}\n`);
                        setMessages(messageData.messages);
                        break;
                    case 'message':
                        setMessages((prevMessages) => [...prevMessages, messageData]);
                        break;
                    case 'roomMessage':
                        handleNewRoomMessage(messageData);
                        break;
                    case 'onlineStatus':
                        updateOnlineStatus(messageData.onlineStatus);
                        break;
                }
            };

            const handleClose = () => {
                setOutput((prevOutput) => prevOutput + 'WebSocket connection closed\n');
            };

            const handleError = (error: Event) => {
                setOutput((prevOutput) => prevOutput + `WebSocket error: ${error}\n`);
            };

            ws.addEventListener('open', handleOpen);
            ws.addEventListener('message', handleMessage);
            ws.addEventListener('close', handleClose);
            ws.addEventListener('error', handleError);

            return () => {
                ws.removeEventListener('open', handleOpen);
                ws.removeEventListener('message', handleMessage);
                ws.removeEventListener('close', handleClose);
                ws.removeEventListener('error', handleError);
            };
        }
    }, [ws, currentUser.user_id, handleGetRooms, updateOnlineStatus, handleNewRoomMessage]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!ws) {
            handleConnect();
        }
    };

    const handleConnect = () => {
        setWs(new WebSocket('ws://localhost:4000'));
    };

    const handleSend = useCallback(() => {
        if (!currentRoomId) {
            setOutput((prevOutput) => prevOutput + 'Please select a room first\n');
            return;
        }
        if (message.trim() === '') {
            setOutput((prevOutput) => prevOutput + 'Please type a message first\n');
            return;
        }
        const messageContent = {
            type: 'message',
            message_text: message,
            sender_id: currentUser.user_id,
            user_id: currentUser.user_id,
            user_email: currentUser.email,
            channel_id: currentRoomId,
            date_created: new Date().toISOString(),
            firstname: session?.user?.name?.split(' ')[0],
            lastname: session?.user?.name?.split(' ')[1],
            profile_pic_url: session?.user.image,
            read_msg: 'false'
        };
        console.log('messageContent before sent to srver.js', messageContent);
        ws?.send(JSON.stringify(messageContent));
        setMessages((prevMessages: any) => [...prevMessages, messageContent]);
        setOutput((prevOutput) => prevOutput + `Sent: ${JSON.stringify(messageContent)}\n`);
        setMessage('');
    }, [currentRoomId, currentUser.user_id, currentUser.email, session?.user, message, ws]);

    const handleRoomChange = useCallback((room_id: string, message_id: string, member_name: string, member_image: string) => {
        if (room_id) {
            const message = { type: 'join', channel_id: room_id, user_id: currentUser.user_id };
            ws?.send(JSON.stringify(message));
            setCurrentRoomId(room_id);
            setOutput(''); // Clear previous messages when switching rooms
            setShowConversations(true); // Show conversations div and hide contacts div
            readMessage(message_id);
            setChateeImage(member_image);
            setChateeName(member_name)

        }
    }, [currentUser.user_id, ws, readMessage]);

    const handleBackToContacts = () => {
        setShowConversations(false);
        setCurrentRoomId(null);
    };

    return (
        <div className="fixed bottom-0 right-0 m-2 w-96" id="chat-parent-wrapper">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-2 bg-blue-500 text-white">
                    <div className="flex flex-row items-center">
                        <Avatar
                            src={session?.user.image}
                            className="h-6 w-6 bg-white mr-2"
                            onError={() => handleAvatarError}
                        />
                        <h2 className="text-xs font-semibold">Messaging</h2>
                    </div>
                    {isOpen ? (
                        <ChevronDownIcon onClick={toggleChat} className="h-6 w-6 cursor-pointer hover:bg-white hover:text-gray-600 rounded-full" />
                    ) : (
                        <ChevronUpIcon onClick={toggleChat} className="h-6 w-6 cursor-pointer hover:bg-white hover:text-gray-600 rounded-full" />
                    )}
                </div>
                {isOpen && (
                    <div className="p-4">
                        <div id="messaging-contacts" className="max-h-96 overflow-auto mb-2 block">
                            {rooms.map((room) => (
                                <li 
                                    key={room.message_id} 
                                    onClick={() => handleRoomChange(room.channel_id, room.message_id, room.member_name, room.image)} 
                                    className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer overflow-hidden pb-2 border-b-2"
                                    id={`roomId-${room.channel_id}`}
                                >
                                    <Avatar
                                        src={room.image}
                                        className={`h-8 w-8 bg-white rounded-full border-solid border-2 ${onlineStatuses[room.member_id] ? 'border-green-600': 'border-gray-600 border4'}`}
                                        alt={room.member_name}
                                        onError={() => handleAvatarError}
                                    />
                                    <div className="w-10/12">
                                        <h3 className={`flex flex-row justify-between ${onlineStatuses[room.member_id]} ? 'text-xs font-bold capitalize' : 'text-xs font-bold text-black capitalize'`}>
                                            <span>{room.member_name}</span> 
                                            <span className="text-xs font-normal font-gray-600 text-right">{formatDate(room.date_created)}</span>
                                        </h3>
                                        <div className="flex flex-row justify-between">
                                            <h4 className="text-xs font-medium text-gray-600 truncate w-10/12">{room.message_text}</h4>
                                            {/* <div key={room.message_id} id={`new-message-alert-messageId-${room.message_id}`} className={`relative w-2 h-2 bg-blue-400 rounded-full flex justify-center items-center text-center shadow-xl ${(room.read_msg == 'false' && room.sender_id != currentUser.user_id)? 'block' : 'hidden'}`}></div> */}
                                        </div>
                                    </div>

                                </li>
                            ))}
                        </div>

                        <div id="messaging-conversations-wrapper"   className={`w-96 flex flex-col bg-white rounded-lg max-h-full pb-2 ${showConversations ? (mobileScreen ? 'block absolute bottom-0 right-0' : 'block absolute -left-2 top-0 -translate-x-full') : 'hidden'}`}>
                            <div id="messaging-conversations" className={`h-96 overflow-auto `}>
                                <div className="sticky top-0 bg-blue-600 z-50 rounded-t-lg flex flex-row items-center align-center justify-between py-2">
                                    <div className="ml-2 flex flex-row items-center">
                                        <Avatar
                                            src={chateeImage}
                                            className="h-6 w-6 bg-white mr-2"
                                            onError={() => handleAvatarError}
                                        />
                                        <h2 className="text-xs font-semibold text-white" id="chatee">{chateeName}</h2>
                                    </div>
                                    <XMarkIcon onClick={handleBackToContacts} className="h-6 w-6 cursor-pointer hover:bg-white hover:text-gray-600 rounded-ful text-white rounded-full mr-2" />
                                </div>
                                <div className="space-y-4 bg-white">
                                    {messages.map(renderMessageCard)}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div className="flex flex-col items-center align-center justify-center mt-2 block">
                                <Textarea
                                    label="Message"
                                    placeholder="Type your message here"
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-2 rounded max-w-sm text-xs"
                                    disabled={!ws}
                                />
                                <div className="w-full flex justify-end">
                                    <Button className="cursor-pointer bg-blue-600 text-white font-bold text-xs mr-2" size="sm" onClick={handleSend}>SEND</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

ChatComponent.displayName = 'ChatComponent';

export default ChatComponent;
