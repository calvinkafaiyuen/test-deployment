"use server";
import query from "@/app/lib/pgdb";
import { auth } from "@/auth";

export async function canEditPitchesMeetings() {
  const session = await auth();
  if(session?.user?.role === 'admin' || session?.user?.role === 'connector') return true;
  return false;
}

export async function getPitchesMeetings(team_id: number){    
  try {  
    const statement = `
      SELECT 
      pitch_reference, pitch_name, 
      date_submitted, presentation_date, 
      pitching_comment, video_url
      FROM pitches WHERE team_id = $1 ORDER BY presentation_date DESC
    `;
    const data = await query(statement, [team_id]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch pitches meetings.`);
  }
}

export async function getPitchHistory(pitch_reference: number ) {
  try {  
    const statement = `
      SELECT pitching_comment, updated_at
      FROM pitches_history WHERE pitch_reference = $1 ORDER BY updated_at DESC
    `;
    const data = await query(statement, [pitch_reference]);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch pitch history.`);
  }
}

export async function patchPitchMeeting(pitch_reference: number, pitching_comment: string, new_pitching_comment: string) {
  const session = await auth();
  if (session?.user?.role !== 'connector' && session?.user?.role !== 'admin') {
    return 'Your permission does not allow this action.';
  }  

  try {
    let statement = `
      INSERT INTO pitches_history (pitch_reference, pitching_comment)
      VALUES ($1, $2)
    `;
    await query(statement, [pitch_reference, pitching_comment]);

    statement = `
      UPDATE pitches
      SET pitching_comment = $1 WHERE pitch_reference = $2
    `;
    await query(statement, [new_pitching_comment, pitch_reference]);
    console.log('success');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to save changes.`);
  }
}

export async function postNewMeeting(team_id: number, pitch_name: string, presentation_date: string) {
  const session = await auth();
  if (session?.user?.role !== 'connector' && session?.user?.role !== 'admin') {
    return 'Your permission does not allow this action.';
  }  
  
  try {
    let statement = `
      INSERT INTO pitches (team_id, pitch_name, presentation_date)
      VALUES ($1, $2, TO_TIMESTAMP($3, 'YYYY-MM-DD"T"HH24:MI'))
    `;
    await query(statement, [team_id, pitch_name, presentation_date]);
    console.log('success');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to save changes.`);
  }
}

