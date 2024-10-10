import SideNav from '@/app/ui/dashboard/account/sidenav';
import React from "react";
import ChatComponent from '@/app/ui/dashboard/account/chat';
import { checkAccess } from '@/app/lib/utils/access';

export default async function Layout({ children }: { children: React.ReactNode }) {

//   const data = await checkAccess('2573');

  return (
    // <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-100">
    //   <SideNav team_id="1234" />
    //   <div className="flex flex-col w-full h-full">
    //     <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white  ml-2">{children}</div>
    //   </div>
    //   <ChatComponent user={data.user} />
    // </div>
    <div className="">{children}</div>
  );
}