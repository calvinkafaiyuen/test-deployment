"use client"

import React from "react";
import { Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 lg:pb-14 lg:px-20 flex flex-col items-center">
      <div className="flex justify-between">
        <Image src="/new/speakerseries.png" alt="speaker series image" />
        <Image src="/new/splash.png" alt="splash image" />
      </div>

      <div className="mt-14 flex justify-between flex-col md:flex-row">
        <div className="md:w-1/5 flex flex-col items-center justify-between">
          <Image width={100} src="/new/speaker.png" alt="speaker image" />
          <p className="text-center my-5"> Every Tuesday, meet and hear from successful leaders and role models. </p>
        </div>
        <div className="md:w-2/5 flex flex-col items-center justify-evenly">
          <Image src="/new/networking.png" alt="networking image" />
          <p className="text-center my-5"> Network with the speaker and other like-minded individuals interested in entrepreneurship. </p>
        </div>
        <div className="md:w-1/5 flex flex-col items-center justify-between">
          <Image width={100} src="/new/freefood.png" alt="free food image" />
          <p className="text-center my-5"> Oh, and by the way.. There’s free food and drinks on the Hatchery. </p>
        </div>
      </div>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100">
      <p className="text-3xl font-bold"> ABOUT SPEAKER </p>
      <Spacer y={6} />
      <div className="flex justify-between flex-col md:flex-row">

        <div className="w-full md:w-1/3 font-bold">
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon1.png" alt="calendar icon"/> 
            <text className="ml-8"> TUESDAY </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon2.png" alt="time icon"/> 
            <text className="ml-8"> 12:00PM-2:00PM </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon3.png" alt="location icon"/> 
            <text className="ml-8"> ONLINE CONFERENCE </text> 
          </div>
        </div>
      </div>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col md:flex-row items-center justify-between text-lg">
      <div> UPCOMING SPEAKER </div>
      <Spacer y={6} />
      <div className="flex flex-col items-center">
        <p> PAST SPEAKER </p>
        <p> 2023-03-14 </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section1 />
      <Spacer y={1} />
      <Section2 />
      <Spacer y={1} />
      <Section3 />
    </main>
  );
}