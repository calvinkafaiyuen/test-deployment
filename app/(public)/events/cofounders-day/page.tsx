"use client"

import React from "react";
import { Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex justify-between flex-col md:flex-row align-center justify-between bg-orange-400">
      <Image width={350} src="/cofoundersDay/CoFounders Day_Logo-white.png" alt="cofounders day logo" />
      <Image width={400} src="/cofoundersDay/co-founder day-figure1.png" alt="cofounders day figure 1" />
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 slate-100 flex" >
      <Image src="/cofoundersDay/co-founder day-figure2.png" alt="cofounders day figure 2" />
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100">
      <p className="text-3xl font-bold"> ABOUT </p>
      <Spacer y={6} />
      <div className="flex justify-between flex-col md:flex-row">
        <p className="w-full md:w-1/2 mb-10 md:mb-0"> 
          Come out to our annual Hatchery Open House - this is an opportunity for the community at large to meet the Hatchery talent! 
          Participants will get the chance to pitch their ideas, meet entrepreneurs from different programs and join multidisciplinary startup teams.
        </p>

        <div className="w-full md:w-1/3 font-bold">
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon1.png" alt="calendar icon" /> 
            <text className="ml-8"> JANUARY 15, 2019 </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon2.png" alt="time icon" /> 
            <text className="ml-8"> 4-6 PM  </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon3.png" alt="location icon" /> 
            <text className="ml-8"> Myhal Center 5th Floor </text> 
          </div>
          <Button color="primary"> RVSP </Button>
        </div>
      </div>
    </div>
  );
}

const Section4 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-4xl font-bold text-orange-400 mb-6"> {"COULDN'T MAKE IT?"} </p>
      <p className="text-5xl font-bold p-5"> JOIN US @ IDEA MARKET </p>
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
      <Section4 />
    </main>
  );
}