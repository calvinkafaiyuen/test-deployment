"use client"

import React from "react";
import { Card, CardBody, Spacer, Image, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center bg-teal-100">
      <p className="text-5xl text-center font-bold">
        BUILD A TEAM
      </p>
      <Spacer y={6} />
      <p className="text-lg text-center">
        Build a team is a tool designed to match you with other individuals and or startups based on your skills and interests.
      </p>
      <Spacer y={12} />
      <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card
          isBlurred
          isPressable
          className="p-6 lg:p-12 bg-background/60 hover:bg-background/80 w-full"
          shadow="lg"
          href="/services/build-a-team/looking-for-cofounders"
          as={Link}
        >
          <CardBody className="flex flex-col items-center">
            <Image
              width={250}
              src="/services/build-a-team/BAT_finding_cofounders.png"
              alt="BAT Finding Cofounders"
            />
            <Spacer y={6} />
            <p className="text-xl font-bold">
              I&#34;m looking for cofounders
            </p>
          </CardBody>
        </Card>
        <Card
          isBlurred
          isPressable
          className="p-6 lg:p-12 bg-background/60 hover:bg-background/80 w-full"
          shadow="lg"
          href="/services/build-a-team/looking-for-a-startup"
          as={Link}
        >
          <CardBody className="flex flex-col items-center">
            <Image
              width={250}
              src="/services/build-a-team/BAT_joining_a_team.png"
              alt="BAT Joining Team"
            />
            <Spacer y={6} />
            <p className="text-xl font-bold">
              I&#34;m looking for a startup
            </p>
          </CardBody>
        </Card>
      </div>
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
