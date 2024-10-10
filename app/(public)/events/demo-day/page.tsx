"use client"

import React from "react";
import { Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-[url('/demoday2018/speech.jpg')] bg-cover">
      <p className="text-9xl font-bold"> DEMO </p>
      <Spacer y={2} />
      <p className="text-9xl font-bold"> DAY </p>
      <Spacer y={6} />
      <p className="text-2xl"> THE CULMINATION OF THE HATCHERY NEST PROGRAM </p>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20">
      <p className="text-3xl font-bold"> WHAT IS DEMO DAY? </p>
      <Spacer y={6} />
      <p> 
        Demo Day is the culmination of The Hatchery NEST, a four-month process which pairs student teams with experienced mentors -- including executives, lawyers, entrepreneurs etc. -- to develop their businesses. 
        They receive detailed feedback on their business plans, explore their proposed market, learn about patents and marketing, and build prototypes using 3D printers and other fabrication resources. 
      </p>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-[url('/demoday2018/inspiration.png')] bg-cover flex justify-center">
      <div className="flex flex-col items-center p-8 text-3xl text-white font-bold bg-slate-950 bg-opacity-70">
        <p> INTERESTED IN BECOMING A HATCHERY TEAM? </p>
        <Spacer y={6} />
        <p> GET INVOLVED </p>
        <Spacer y={10} />
        <Button color="primary"> APPLY NOW </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section1 />
      <Section2 />
      <Section3 />
    </main>
  );
}