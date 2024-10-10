"use client"

import React from "react";
import { Spacer, Button, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <p className="font-bold text-4xl">
        Application Submitted!
      </p>
      <Spacer y={8}/>
      <p className="text-xl">
        We look forward to having you join us at the Hatchery!
      </p>
      <Spacer y={8}/>
      <Button href="/" as={Link} color="primary" variant="ghost" size="lg">
       Return Home
      </Button>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section />
    </main>
  );
}
