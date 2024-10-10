"use client";

import React from "react";
import { Spacer, Button } from "@nextui-org/react";
import Image from "next/image";
import HatcheryNavigation from "@/app/ui/navigation";
import Link from "next/link";

const Section1 = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between px-5 lg:pl-20 lg:pr-0">
      <div className="w-full lg:w-1/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-left">
            <Spacer y={24}></Spacer>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800">
              WE CREATE
            </h1>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mt-2">
              STARTUPS
            </h1>
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-base text-gray-600">
              Founded in 2012, The Entrepreneurship Hatchery provides a
              comprehensive suite of programs and services designed to help
              students with entrepreneurial ambitions form teams, develop new
              competencies and launch their companies. Over the last five years,
              The Hatchery has helped to launch over 94 new startups, which
              collectively have raised close to $64 million in seed funding.
              Students start by attending events throughout the school year —
              the Hatchery offers Idea Markets, Speaker Series, Coffee Days,
              Cofounders Day, Hatchery Circle, Accelerator Weekend - events that
              nurture a strong culture of entrepreneurship on campus. From
              there, teams apply to one of the Hatcheryn&apos;s four processes:{" "}
              <b>Hatchery NEST</b>, designed for all current U of T students,{" "}
              <b>Hatchery LaunchLab</b>, which caters to graduate-level research
              driven startups looking to commercialize their discoveries,{" "}
              <b>Hatchery Social</b>, which enables social impact startups such
              as non-for-profit and social critical challenges, and the{" "}
              <b>Start@UTIAS+Hatchery</b>, which is a process designed for UTIAS
              students or recent graduates with the goal of feeding into either
              the NEST or LaunchLab stream.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <Spacer y={12}></Spacer>
        <Image
          src="/about-us/about-us-about-top-logo.png"
          width={500}
          height={300}
          alt="about us program logo"
          className="w-full"
        />
      </div>
    </div>
  );
};

const Section2 = () => {
  return (
    <div className="flex flex-col justify-between px-5 lg:px-20 text-gray-300 bg-[rgb(56,12,58)]">
      <h2 className="text-2xl lg:text-3xl font-bold text-cyan-300">
        OUR PROGRAMS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-5">
        {/* Column 1 */}
        <div className="space-y-2">
          <Image
            src="/about-us/nest-logo2.png"
            alt="nest logo"
            width={300}
            height={55}
            className="mb-3"
          />
          <div className="inline-block bg-cyan-300 hover:font-bold text-white text-center py-2 px-4 w-full">
            <Link href="/programs/nest" className="text-white hover:text-bold">
              Learn more
            </Link>
          </div>
          <p>
            Hatchery NEST is an intensive four-month program running from May to
            August each year. Teams are matched with advisory boards including
            dedicated mentors, and have access to resources such as professional
            services, including lawyers to help secure intellectual property
            protection, and marketing experts to help refine branding.
            <br></br>
            <br></br>
            Through bi-weekly pitch sessions, the teams also receive detailed
            feedback on how to hone their message and build the confidence that
            will enable them to attract their first investors. The process
            culminates in Demo Day, held early each September, where the
            remaining teams compete for a share of more than $40,000 in seed
            funding.
          </p>
        </div>

        {/* Column 2 */}
        <div className="space-y-2">
          <Image
            src="/about-us/launch-lab2.png"
            alt="launch-lab"
            width={300}
            height={55}
            className="mb-3"
          />
          <div className="inline-block bg-cyan-300 hover:font-bold text-white text-center py-2 px-4 w-full">
            <Link
              href="/programs/launch-lab"
              className="text-white hover:text-bold"
            >
              Learn more
            </Link>
          </div>
          <p>
            Enabling Graduate and Faculty-level Research Driven Startup
            Companies. Providing support to research-based startups, led by
            graduate students and faculty. We enable teams to sustain themselves
            while they complete the steps necessary to define a business model
            for their technology and attract investment.
          </p>
        </div>

        {/* Column 3 */}
        <div className="space-y-2">
          <Image
            src="/about-us/utias-hatchery2.png"
            alt="utias hatchery"
            width={300}
            height={55}
            className="mb-1"
          />
          <div className="inline-block bg-cyan-300 hover:font-bold text-white text-center py-2 px-4 w-full">
            <Link href="/programs/utias" className="text-white hover:text-bold">
              Learn more
            </Link>
          </div>
          <p>
            A partnership between the Hatchery and the University of Toronto
            Institute for Aerospace Studies students (UTIAS), accepted teams
            must have at least one UTIAS student (or recent graduate) to receive
            funding, mentorship and access to resources.
          </p>
        </div>

        {/* Column 4 */}
        <div className="space-y-2 hidden lg:block">
          <Image
            src="/about-us/hatchery-social2.png"
            alt="hatchery social"
            width={300}
            height={55}
            className="mb-1"
          />
          <div className="inline-block bg-cyan-300 hover:font-bold text-white my-20 text-center py-2 px-4 w-full">
            <Link
              href="/programs/hatchery-social"
              className="text-white hover:text-bold"
            >
              Learn more
            </Link>
          </div>
          <p>
            Built to enable social impact startups, such as non-for-profit or
            social critical challenges.
          </p>
        </div>

        {/* Column 5 */}
        <div className="space-y-2 hidden xl:block">
          <Image
            src="/about-us/hatchery_alumni_logo-03.png"
            alt="alumni-logo"
            width={300}
            height={55}
            className="mb-1"
          />
          <div className="inline-block bg-cyan-300 hover:font-bold text-white text-center py-2 px-4 w-full">
            <Link
              href="/programs/alumni/"
              className="text-white hover:text-bold"
            >
              Learn more
            </Link>
          </div>
          <p>
            The Hatchery Alumni program will enable Faculty of Applied Science
            and Engineering (FASE) Alumni to make use of The Entrepreneurship
            Hatchery platform in the creation of their own startups.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 my-5">
        <div className="space-y-2 grid grid-cols-1 sm:grid-cols-2">
          <div>
            <h2 className="text-cyan-300 text-2xl lg:text-3xl font-bold my-5">
              WHAT IS DEMO DAY?
            </h2>
            <p>
              Demo Day is the culmination of The Hatchery NEST, a four-month
              process which pairs student teams with experienced mentors --
              including executives, lawyers, entrepreneurs etc. -- to develop
              their businesses. They receive detailed feedback on their business
              plans, explore their proposed market, learn about patents and
              marketing, and build prototypes using 3D printers and other
              fabrication resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section3 = () => {
  return (
    <div id="bottom">
      <div id="bottom-title">THE TEAM</div>
      <div id="bottom-members-container">
        {/* need a component to loop through the teams */}
      </div>
    </div>
  );
};

const Section4 = () => {
  return (
    <div id="bottom">
      <div id="bottom-title">OUR ADVISORY BOARD</div>
      <div id="bottom-members-container">
        {/* need a component to loop through the advisors */}
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <main>
      <div id="compact-container">
        <HatcheryNavigation />
        <Section1 />
        <Section2 />
        <Section3 />
        <Spacer y={2} />
        <Section4 />
      </div>
    </main>
  );
}
