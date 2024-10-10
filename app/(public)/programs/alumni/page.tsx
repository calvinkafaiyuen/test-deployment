"use client"

import React from "react";
import { Accordion, AccordionItem, Spacer, Image, Button, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/programs/alumni/hatchery_alumni_logo.png"
        alt="Alumni Logo"
      />
      <Spacer y={6} />
      <p className="text-lg text-center">
        The Hatchery Alumni program, will enable Faculty of Applied Science and Engineering (FASE) Alumni 
        to make use of The Entrepreneurship Hatchery platform in the creation of their own startups. 
        This new program has been inspired by a now very frequent quote from alumni “I wish the Hatchery was there for us back then.”
      </p>
      <Spacer y={6} />
      <Button href="/programs/alumni/apply" as={Link} color="primary" size="lg">
        Apply
      </Button>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 bg-slate-100">
      <p>
      Hatchery Alumni program strives with nothing more than a team of committed co-founders and meaningful problem to solve.
      </p>
      <Spacer y={6} />
      <p className="font-bold">
        Application Deadline: Rolling Applications
      </p>
    </div>
  );
}

const Section3 = () => {
  
  const evangelismTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">1. ELIGIBILITY</p>
    </div>
  )
  
  const summerCohortTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">2. WHAT YOU GET</p>
    </div>
  )
  
  const demoDayTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">3. PROCESS</p>
    </div>
  )

  return (
    <div className="px-8 py-16">
      <p className="text-3xl font-bold text-center">HOW IT WORKS</p>
      <Spacer y={6} />
      <Accordion>
        <AccordionItem className="py-6" key="1" aria-label="EVANGELISM" title={evangelismTitle}>
          <div>
            <ul className="ml-10 list-disc">
              <li>Teams led by FASE undergraduate and graduate programs will be eligible to apply.</li>
              <Spacer y={2} />
              <li>Teams should comprise of 2–5 co-founders with at least 1 FASE alumni.</li>
              <Spacer y={2} />
              <li>Current graduate students must have supervisor’s permission.</li>
              <Spacer y={2} />
              <li>FASE Alumni requires to have at least a 50% time commitment in the startup.</li>
              <Spacer y={2} />
              <li>Note: FASE Alumni may apply as an individual and take advantage of the Hatchery Build-a- Team tool as they become eligible to the program.</li>
            </ul>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="2" aria-label="SUMMER COHORT" title={summerCohortTitle}>
          <div>
            <ul className="ml-10 list-disc">
              <li>Membership to the Hatchery.</li>
              <Spacer y={2} />
              <li>A unique Hatchery Advisory Board, access to space and access to Myhal fabrication facility.</li>
              <Spacer y={2} />
              <p>Note: Each Hatchery Advisory Board is made up of:</p>
              <Spacer y={2} />
              <ul className="ml-10 list-decimal">
                <li>Business Mentors</li>
                <li>Technical Mentors</li>
                <li>Connectors (may include MBA Student, Master of Management of Innovation intern and a Faculty of Law student)</li>
              </ul>
              <Spacer y={2} />
              <li>Guidance to define their business model and validate their product market fit.</li>
              <Spacer y={2} />
              <li>Guidance to develop the startup’s business plan canvas, cashflow projections and investor ready pitch.</li>
              <Spacer y={2} />
              <li>Successful teams will eligible to the Go-To-Market stage, including access to professional services.</li>
              <Spacer y={2} />
              <li>Demo Day access. Successful teams may earn a spot in the Hatchery Demo Day</li>
              <Spacer y={2} />
            </ul>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="3" aria-label="DEMO DAY" title={demoDayTitle}>
          <div>
            <ul className="ml-10 list-disc">
              <li>
                <span className="font-bold">Interview (Gate 1):</span> We will use our current interview process (in partnership with our mentors and EAN Board) 
                to make an admission decision based on the team’s configuration, time commitment and the objective of the start-up (problem to solve)
              </li>
              <Spacer y={2} />
              <li>
                <span className="font-bold">Business Plan Canvas + Pitch Preparation (Gate 2):</span> With the guidance of a Hatchery Advisory Board 
                the team will develop a business plan canvas, cash flow projections and an investor ready pitch.
              </li>
              <Spacer y={2} />
              <li>
                <span className="font-bold">Alumni Committee:</span> The startup will be presenting to a selected group of FASE alumni (EAN Board candidates) 
                that will serve the purpose of sounding board in preparation the investment committee presentation. 
                stage of the process, in our view, will be a bridge to bringing the FASE alumni community together (alumni helping alumni).
              </li>
              <Spacer y={2} />
              <li>
                <span className="font-bold">Committee + Introduction to the Investment Community:</span> The role of the volunteer Investment Committee 
                 is for professional investors to help assess financing opportunities by reviewing the investment materials 
                 developed by the startups and the in-person investment pitch. This presentation will be a segue way to 
                 introducing the startup to the Investment Community at large.
              </li>
            </ul>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

const Section4 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center bg-slate-100">
      <p className="text-3xl font-bold">
        READY TO APPLY?
      </p>
      <Spacer y={6} />
      <Button href="/programs/alumni/apply" as={Link} color="primary" size="lg">
        Apply
      </Button>
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
