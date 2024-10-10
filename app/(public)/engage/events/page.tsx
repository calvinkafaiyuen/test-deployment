"use client"

import React from "react";
import { Spacer, Image, Button, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-7xl font-bold"> ENGAGE WITH US </p>
      <Spacer y={6} />
      <p className="text-lg">
        GET INSPIRED. SHARE BUSINESS IDEAS. 
      </p>
      <p className="text-lg">
        BUILD YOUR ENTREPRENEURIAL NETWORK
      </p>
      <Spacer y={6} />
      <p className="text-2xl font-bold"> See Full Calendar </p>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="flex justify-center pb-8 lg:pb-14">
      <Link href="/events/idea-market" className="w-fit">
        <Image src="https://hatchery.engineering.utoronto.ca/wp-content/uploads/2022/01/idea-market.png" alt="idea market" />
      </Link>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100 flex">
      <div className="bg-zinc-200 rounded-full text-2xl w-[100px] h-[100px] flex justify-center items-center mr-10"> 
        Feb 07
      </div>
      <div>
        <p className="text-3xl font-bold">
          IDEA MARKET
        </p>
        <Spacer y={6} />
        <p>
          <span className="font-bold"> TIME: </span> February 07 from 12:00 - 14:00
        </p>
        <p>
          <span className="font-bold"> LOCATION: </span> Myhal Centre - 55 St George Street - Room 620
        </p>
        <Spacer y={6} />
        <Button color="primary" size="lg">
          Register
        </Button>
      </div>
    </div>
  );
}

const Section4 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100 flex">
      <div className="bg-zinc-200 rounded-full text-2xl w-[100px] h-[100px] flex justify-center items-center mr-10"> 
        Feb 08
      </div>
      <div>
        <p className="text-3xl font-bold">
          LAUNCHLAB INFO SESSION
        </p>
        <Spacer y={6} />
        <p>
          <span className="font-bold"> TIME: </span> February 08 from 12:00 - 13:00
        </p>
        <p>
          <span className="font-bold"> LOCATION: </span> main
        </p>
        <Spacer y={6} />
        <Button color="primary" size="lg">
          Register
        </Button>
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
      <Spacer y={1} />
      <Section4 />
    </main>
  );
}