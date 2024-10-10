import SideNav from '@/app/ui/dashboard/account/sidenav';
import TeamDropdown from '@/app/ui/dashboard/account/teamdropdown';
import React from "react";
import ChatComponent from '@/app/ui/dashboard/account/chat';
import { checkAccess } from '@/app/lib/utils/access';

export default async function Layout({ children, params }: { children: React.ReactNode, params: { team_id: string } }) {
  console.log('params.team_id', params.team_id);
  const data = await checkAccess(params.team_id);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-100">
      <SideNav team_id={params.team_id} isAdmin={data.role === 'admin'}/>
      <div className="flex flex-col w-full h-full">
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white ml-2">
          {data.access && (data.role == 'connector' || data.role == 'mentor') && (
            <TeamDropdown team_id={params.team_id} />
          )}
          {children}
        </div>
      </div>
      {data.access && data.role == 'founder' && (
        <ChatComponent user={data.user} />
      )}
    </div> 
  );
}