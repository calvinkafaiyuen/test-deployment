"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function getTeams() {    
  const session = await auth();
  const role = session?.user?.role;
  const email = session?.user?.email;

  switch(role) {
    case 'mentor':
      try {  
        const statement = `SELECT teams.team_image, teams.team_id AS id, status, teams.team_name, teams.cohort, teams.project_id AS pid 
                           FROM teams INNER JOIN project_mentor_rlshp ON project_mentor_rlshp.project_id = teams.project_id 
                           WHERE project_mentor_rlshp.mentor_id = $1 ORDER BY teams.time_registered DESC`
        const data = await query(statement, [email]);
        return data;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch teams.`);
      }

    case 'connector':
      try {  
        const res = await query(`SELECT id FROM connectors WHERE email = $1`, [email]);
        const connector_id = res[0].id;
        const statement = `SELECT teams.team_image, teams.team_id AS id, status, teams.team_name, teams.cohort, teams.project_id AS pid 
                           FROM teams INNER JOIN project_connector_rlshp ON project_connector_rlshp.project_id = teams.project_id 
                           WHERE project_connector_rlshp.connector_id = $1 ORDER BY teams.team_name ASC`
        const data = await query(statement, [connector_id]);
        return data;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to fetch teams.`);
      }
    
    default:
      return [];
  }
}
