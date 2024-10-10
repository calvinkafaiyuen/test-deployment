"use client"

import { Image } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';
import ProgramFormComponent from "../../components/ProgramFormComponent";

const Header = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/programs/alumni/hatchery_alumni_logo.png"
        alt="Alumni Logo"
      />
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Header />
      <ProgramFormComponent programType="Hatchery Alumni" />
    </main>
  );
}
