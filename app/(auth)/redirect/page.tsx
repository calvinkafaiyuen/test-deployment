import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {Spinner} from "@nextui-org/react";
import query from '@/app/lib/pgdb';
import { getTeams } from '@/app/lib/actions/account/teamdropdown.action';

async function handleURL(session: any) {
  switch(session.user.role) {
    case 'admin':
      redirect('/admin/programs/nest');
    case 'founder':
      const founder = await query('SELECT team_id, uoft_email, student_num FROM students WHERE uoft_email=$1 ORDER BY student_num DESC LIMIT 1', [session.user.email]);
      if(founder.length > 0) redirect(`/account/${founder[0].team_id}/profile`);
    case 'mentor':
      const mentor_teams = await getTeams();
      if(mentor_teams.length > 0) redirect(`/account/${mentor_teams[0].id}/profile`)
    case 'connector':
      const connector_teams = await getTeams();
      if(connector_teams.length > 0) redirect(`/account/${connector_teams[0].id}/profile`)
    default:
      redirect('/');
  }
}

export default async function Page() {
    const session = await auth();
    console.log('/app/redirect/page.tsx: 7', session)

    if(session) await handleURL(session);

    return (
      <main className="flex min-h-screen flex-col justify-center items-center">
        <div className="flex gap-4">
          <Spinner label="Loading" color="primary" labelColor="primary"/>
        </div> 
      </main>
    );
  }