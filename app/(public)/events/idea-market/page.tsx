"use client"

import React from "react";
import { Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col md:flex-row text-orange-400 md:items-center">
      <Image className="mb-10 md:m-0" width={200} radius="none" src="/ideaMarketPage/IdeaMarket Orange Logo.png" alt="ide amarket orange logo" />
      <p className="text-7xl font-bold md:max-w-[300px] md:ml-10"> IDEA MARKET </p>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-slate-100 flex justify-between flex-col md:flex-row">
      <div className="md:w-1/2">
        <p className="text-3xl font-bold"> ABOUT </p>
        <Spacer y={6} />
        <p> 
          The Idea Market is the weekly congregation of Hatchery community members to come together in an open-minded, collaborative, and multi-disciplinary environment.
          We bring together different perspectives from different disciplines to problem solve and generate ideas. 
          Individuals with similar passions can meet and potentially begin their journey to applying for the upcoming NEST Cohort that will go through the rigorous development of their startup in May-August.
        </p>
        <Spacer y={6} />
        <Button color="primary" className="mb-10 md:mb-0"> RVSP </Button>
      </div>

      <div className="font-bold">
        <div className="flex mb-8 items-center"> 
          <Image width={40} radius="none" src="/acceleratorWeekend/icon1.png" alt="calendar icon"/> 
          <text className="ml-8"> EVERY WEDNESDAY AND THURSDAY </text> 
        </div>
        <div className="flex mb-8 items-center"> 
          <Image width={40} radius="none" src="/acceleratorWeekend/icon2.png" alt="time icon"/> 
          <text className="ml-8"> WEDNESDAY 12:00PM-2:00PM </text> 
        </div>
        <div className="flex mb-8 items-center"> 
          <Image width={40} radius="none" src="/acceleratorWeekend/icon2.png" alt="time icon"/> 
          <text className="ml-8"> THURSDAY 12:00PM-1:00PM </text> 
        </div>
        <div className="flex mb-8 items-center"> 
          <Image width={40} radius="none" src="/acceleratorWeekend/icon3.png" alt="location icon"/> 
          <text className="ml-8"> Myhal Center 5th Floor </text> 
        </div>
      </div>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 text-orange-400 flex flex-col md:flex-row items-center">
      <Image src="/ideaMarketPage/Chatting Group.png" alt="chatting group image" />
      <Spacer y={6} />
      <p className="md:pl-20 text-lg">
        Work with fellow entrepreneurs to discuss business and engineering solutions to a variety of real life industry problems.
        <Spacer y={6} />
        Share your ideas, collaborate with like-minded individuals who are interested in entrepreneurship, and potentially meet your future team! 
        <Spacer y={6} />
        As always, there will be free food and drinks! 
      </p>
    </div>
  );
}

const Section4 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 bg-[#0072F5] bg-opacity-70 font-bold text-white">
      <p className="text-3xl text-center"> {"CAN'T MAKE IT? NO WORRIES."} </p>
      <Spacer y={10} />
      <div className="flex justify-around flex-col md:flex-row text-center">
        <div className="md:w-5/12 flex flex-col items-center py-10 px-20 hover:bg-orange-400 duration-300 cursor-pointer"> 
          <p className="text-2xl"> START THE CONVERSATION </p>
          <Spacer y={3} />
          <p className="text-4xl"> SHARE YOUR PROBLEM </p>
          <Spacer y={6} />
          <Image width={250} src="/ideaMarketPage/Chatting Pair.png" alt="chatting pair image" />
        </div>

        <div className="md:w-5/12 flex flex-col items-center py-10 px-20 hover:bg-orange-400 duration-300 cursor-pointer"> 
          <p className="text-2xl"> ENGAGE AT THE </p>
          <Spacer y={3} />
          <Image className="w-[250px]" src="/ideaMarketPage/IdeaMarket White Logo.png" alt="idea market white logo" radius="none" />
        </div>
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
      <Section4 />
    </main>
  );
}