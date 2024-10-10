import React from "react";
import HatcheryFooter from '@/app/ui/footer';

 
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col w-full 2xl:w-1/2 xl:mx-auto">
    {children}
    <HatcheryFooter></HatcheryFooter>
    </div>
  );
}