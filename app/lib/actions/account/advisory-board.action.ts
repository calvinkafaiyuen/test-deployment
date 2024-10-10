"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function canEditAdvisoryBoard() {
  const session = await auth();
  return session?.user?.role === 'admin'
}

export async function getAdvisoryBoardMembers(team_id: number){    
  try {  
    const statement = `
      (SELECT 'Hatchery Mentor' AS role, mentors.first_name AS first_name, mentors.last_name AS last_name, mentors.id AS id, mentors.mentors_id AS email, mentors.mentor_phone AS phone, mentors.mentor_image AS profile_image
        FROM mentors 
        INNER JOIN project_mentor_rlshp ON mentors.mentors_id = project_mentor_rlshp.mentor_id 
        INNER JOIN teams ON project_mentor_rlshp.project_id = teams.project_id 
        WHERE teams.team_id = $1)
        UNION
        (SELECT 'Hatchery Connector' AS role, connectors.firstname AS first_name, connectors.lastname AS last_name, connectors.id AS id, connectors.email AS email, connectors.connector_phone AS phone, connector_image AS profile_image
        FROM connectors
        INNER JOIN project_connector_rlshp ON connectors.id = project_connector_rlshp.connector_id 
        INNER JOIN teams ON project_connector_rlshp.project_id = teams.project_id
        WHERE teams.team_id = $1)
        UNION
        (SELECT 'Hatchery Staff' AS role, employment.firstname AS first_name, employment.lastname AS last_name, NULL AS id, employment.email AS email, employment.phone, '' AS profile_image
        FROM employment
        INNER JOIN team_staff_rlshp ON team_staff_rlshp.staff_id = employment.email 
        INNER JOIN teams ON team_staff_rlshp.team_id = teams.team_id
        WHERE teams.team_id = $1 
        GROUP BY firstname, lastname, email, phone)
        ORDER BY role ASC, first_name ASC
    `;
    const data = await query(statement, [team_id]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch advisory board data.`);
  }
}

export async function getAllAdvisors(){    
  const session = await auth();
  if (session?.user?.role != 'admin') {
    return 'Your permission does not allow access to this information.';
  }

  try {  
    const statement = `
      (SELECT 'm' AS role, mentors.first_name AS first_name, mentors.last_name AS last_name, mentors.id AS id, mentors.mentors_id AS email, mentors.mentor_image AS profile_image
        FROM mentors)
        UNION
        (SELECT 'c' AS role, connectors.firstname AS first_name, connectors.lastname AS last_name, connectors.id AS id, connectors.email, connector_image AS profile_image
        FROM connectors)
        UNION
        (SELECT 's' AS role, employment.firstname AS first_name, employment.lastname AS last_name, NULL AS id, employment.email, '' AS profile_image
        FROM employment GROUP BY first_name, last_name, email) 
        ORDER BY role ASC, first_name ASC
    `;
    const data = await query(statement);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch advisory board data.`);
  }
}

export async function addAdvisors(team_id: number, selectedMentors: any, selectedConnectors: any, selectedStaff: any){    
  const session = await auth();
  if (session?.user?.role != 'admin') {
    return 'Your permission does not allow this action.';
  }
  
  try {  
    let statement = `SELECT project_id FROM teams WHERE team_id = $1`;
    let data = await query(statement, [team_id]);
    const project_id = data[0].project_id;

    statement = `INSERT INTO project_mentor_rlshp (project_id, mentor_id) VALUES`;
    if (selectedMentors.size > 0) {
      Array.from(selectedMentors).forEach((mentor: any, index) => {
        if (index > 0) statement += ','
        const mentor_id = mentor.split(' ').slice(-1)[0];
        statement += ' (' + project_id + ", '" + mentor_id + "')";
      })
      await query(statement);
    }

    statement = `INSERT INTO project_connector_rlshp (project_id, connector_id) VALUES`;
    if (selectedConnectors.size > 0) {
      Array.from(selectedConnectors).forEach((connector: any, index) => {
        if (index > 0) statement += ','
        const connector_id = connector.split(' ').slice(-1)[0];
        statement += ' (' + project_id + ", '" + connector_id + "')";
      })
      await query(statement);
    }

    statement = `INSERT INTO team_staff_rlshp (team_id, staff_id) VALUES`;

    if (selectedStaff.size > 0) {
      Array.from(selectedStaff).forEach((staff: any, index) => {
        if (index > 0) statement += ','
        const staff_id = staff.split(' ').slice(-1)[0];
        statement += ' (' + team_id + ", '" + staff_id + "')";
      })
      await query(statement);
    }

    console.log('success')
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to add advisory board member.`);
  }
}

export async function removeAdvisor(team_id: number, advisor_id: number|string, role: string) {
  const session = await auth();
  if (session?.user?.role != 'admin') {
    return 'Your permission does not allow this action.';
  }

  try {  
    let statement = `SELECT project_id FROM teams WHERE team_id = $1`;
    let data = await query(statement, [team_id]);
    const project_id = data[0].project_id;
    const params = []

    if (role === 'Hatchery Mentor') {
      statement = `DELETE FROM project_mentor_rlshp WHERE project_id = $1 AND mentor_id = $2`;
      params.push(project_id, advisor_id);
    } else if (role === 'Hatchery Connector') {
      statement = `DELETE FROM project_connector_rlshp WHERE project_id = $1 AND connector_id = $2`;  
      params.push(project_id, advisor_id);
    } else {
      statement = `DELETE FROM team_staff_rlshp WHERE team_id = $1 AND staff_id = $2`;
      params.push(team_id, advisor_id);
    }
    await query(statement, params);
    console.log('success')
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to add advisory board member.`);
  }
}
