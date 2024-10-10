"use client"

import React from "react";
import { Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-7xl font-bold"> ACCELERATOR WEEKEND </p>
      <Spacer y={6} />
      <Button color="primary" size="lg">
        Register Now
      </Button>

      <div className="mt-14 flex justify-between flex-col md:flex-row">
        <div className="md:w-1/4 flex flex-col items-center justify-between">
          <Image width={200} src="/acceleratorWeekend/AW Graphics_Entrepreneur.png" alt="AW graphics entrepreneur image" />
          <p className="text-center my-5"> Experience the life of an entrepreneur in the span of 28 hours! </p>
        </div>
        <div className="md:w-1/4 flex flex-col items-center justify-between">
          <Image width={250} src="/acceleratorWeekend/AW Graphics_Teams.png" alt="AW graphics teams image" />
          <p className="text-center my-5"> Work in multidisciplinary teams and receive guidance from successful entrepreneurs. </p>
        </div>
        <div className="md:w-1/4 flex flex-col items-center justify-between">
          <Image width={190} src="/acceleratorWeekend/AW Graphics_Pitch.png" alt="AW graphics pitch image" />
          <p className="text-center my-5"> Develop and pitch your idea for a chance to win $1000! </p>
        </div>
      </div>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100">
      <p className="text-3xl font-bold"> ABOUT </p>
      <Spacer y={6} />
      <div className="flex justify-between flex-col md:flex-row">
        <p className="w-full md:w-1/2 mb-10 md:mb-0"> 
          The Entrepreneurship Hatchery&apos;s Accelerator Weekend allows students to experience the life of an entrepreneur in the span of 28 hours. 
          All students are invited to join this challenge that brings together multidisciplinary teams! With the guidance from successful entrepreneurs, 
          teams will develop a business model around an idea. This journey will be reflected during a pitch that will be presented to the participants and mentors at the 28th hour. 
        </p>

        <div className="w-full md:w-1/3 font-bold">
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon1.png" alt="accelerator weekend icon 1" /> 
            <text className="ml-8"> JANUARY 17-18, 2020 </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon2.png" alt="accelerator weekend icon 2" /> 
            <text className="ml-8"> 17:30 PM  </text> 
          </div>
          <div className="flex mb-8 items-center"> 
            <Image width={40} radius="none" src="/acceleratorWeekend/icon3.png" alt="accelerator weekend icon 3" /> 
            <text className="ml-8"> FIELDS INSTITUTE  </text> 
          </div>
        </div>
      </div>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20">
      <p className="text-3xl font-bold"> ACCELERATOR WEEKEND 2020 </p>
      <Spacer y={6} />
      <div className="flex justify-evenly flex-col md:flex-row items-center md:items-stretch">
        <Image radius="none" style={{objectFit:"cover", height:"100%"}} width={270} src="https://live.staticflickr.com/7820/46839336581_ab8b660f01_n.jpg" alt="" /> 
        <Image radius="none" style={{objectFit:"cover", height:"100%"}} width={270} src="https://live.staticflickr.com/7816/39874286713_ead1a99c8f_h.jpg" alt="" /> 
        <Image radius="none" style={{objectFit:"cover", height:"100%"}} width={270} src="https://live.staticflickr.com/7873/32963837498_8976d04864_n.jpg" alt="" /> 
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