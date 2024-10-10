"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";
import { redirect, usePathname } from 'next/navigation';

export async function checkAccess(team_id: string | number): Promise<{ access: boolean; user: any; role: string }> {
  if (!team_id) redirect('/');
  const session = await auth();
  if (!session) redirect('/');

  const { role, email } = session.user;
  let user: any;

  switch (role) {
    case 'founder':
      const founderQuery = `SELECT team_id, student_num AS user_id, uoft_email AS email FROM students WHERE uoft_email = $1 AND team_id = $2 ORDER BY student_num DESC LIMIT 1`;
      user = await query(founderQuery, [email, team_id]);
      console.log(user);
      if (user.length == 0 ) redirect('/');
      break;

    case 'mentor':
      const mentorQuery = `
        SELECT * FROM project_mentor_rlshp 
        INNER JOIN teams ON project_mentor_rlshp.project_id = teams.project_id
        WHERE project_mentor_rlshp.mentor_id = $1 AND teams.team_id = $2`;
      user = await query(mentorQuery, [email, team_id]);
      if (user.length == 0 ) redirect('/');
      break;

    case 'connector':
      const connectorQuery = `
        SELECT * FROM project_connector_rlshp 
        INNER JOIN teams ON project_connector_rlshp.project_id = teams.project_id
        INNER JOIN connectors ON connectors.id = project_connector_rlshp.connector_id
        WHERE connectors.email = $1 AND teams.team_id = $2`;
      user = await query(connectorQuery, [email, team_id]);
      if (user.length == 0 ) redirect('/');
      break;

    case 'admin':
      return { access: true, user: [], role };

    default:
      return { access: false, user: [], role: '' };
  }

  return { access: !!user.length, user, role };
}
