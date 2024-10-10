"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function canEditAdvisoryBoard() {
  const session = await auth();
  return session?.user?.role === 'admin' || session?.user?.role === 'founder'
}

export async function getCofounders(team_id: number){    
  try {  
    const statement = `
      SELECT firstname, lastname, status, linkedin_url, phone, university, program, uoft_email, personal_email, interests, profile_pic_url FROM team_member_rlshp
      LEFT JOIN students ON students.uoft_email = team_member_rlshp.student_id LEFT JOIN teams ON team_member_rlshp.team_id = teams.team_id
      WHERE students.validation='good' AND team_member_rlshp.team_id =  $1
    `;
    const data = await query(statement, [team_id]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch advisory board data.`);
  }
}

