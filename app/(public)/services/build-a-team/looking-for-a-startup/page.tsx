"use client"

import { Image, Spacer } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';
import BatFormComponent from "../components/BatFormComponent";

const Header = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/services/build-a-team/BAT_joining_a_team.png"
        alt="BAT Joining Team"
      />
      <Spacer y={8}/>
      <p className="text-4xl font-bold">
        Build a Team - Startup Search
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Header />
      <BatFormComponent batSearchType="Startup Search" />
    </main>
  );
}
