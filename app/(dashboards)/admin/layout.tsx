import SideNav from '@/app/ui/dashboard/admin/sidenav';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  // console.log('@/app/dashboard/layout.tsx: line 10 session:', session)
  if(session?.user.role != 'admin') redirect('/')

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-100">
      <SideNav />
      <div className="flex flex-col w-full h-full">
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white  ml-2 ag-theme-quartz">{children}</div>
      </div>
    </div>
  );
}