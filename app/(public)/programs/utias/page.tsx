"use client"

import React from "react";
import { Accordion, AccordionItem, Spacer, Image, Button, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/programs/utias/utias_hatchery.png"
        alt="Utias Logo"
      />
      <Spacer y={6} />
      <p className="text-lg text-center">
        Start@UTIAS and the UofT Entrepreneurship Hatchery have formed an alliance to provide UTIAS students, 
        including alumni, an effective program to create a startup business.
      </p>
      <Spacer y={6} />
      <Button href="/programs/utias/apply" as={Link} color="primary" size="lg">
        Apply
      </Button>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 bg-slate-100">
      <p>
        Students can come to Start@UTIAS + Hatchery process with nothing more than a team of committed co-founders and meaningful problem to solve.
      </p>
      <Spacer y={6} />
      <p className="font-bold">
        First Application Deadline: Oct 30th - 11:59pm
      </p>
      <Spacer y={2} />
      <p className="font-bold">
        Second Application Deadline: Nov 30th - 11:59pm
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
              <li>Masters, PhDs, PostdocsTeams should have 2–5 co-founders with a at least 1 UTIAS member</li>
              <Spacer y={2} />
              <li>UTIAS member can be a recent graduates within 2 years</li>
              <Spacer y={2} />
              <li>Current Graduate students must have supervisor’s permission/support</li>
              <Spacer y={2} />
              <li>Exceptions to the above will be discussed on a case by case basis</li>
            </ul>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="2" aria-label="SUMMER COHORT" title={summerCohortTitle}>
          <div>
            <ul className="ml-10 list-disc">
              <li>Up to $50,000 in funding over a 12 month period</li>
              <Spacer y={2} />
              <li>Up to $10,000 in funding for the first 60 days</li>
              <Spacer y={2} />
              <li>Streamline to join the Hatchery NEST, LaunchLab, or SOCIAL</li>
              <Spacer y={2} />
              <ul className="ml-10 list-disc">
                <li><span className="font-bold">NEST</span> - Application Deadline January 31st</li>
                <li><span className="font-bold">Launch Lab</span> - Rolling application</li>
                <li><span className="font-bold">SOCIAL</span> - Rolling application</li>
              </ul>
            </ul>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="3" aria-label="DEMO DAY" title={demoDayTitle}>
          <div>
            <ul className="ml-10 list-disc">
              <li>Funding Decision: 2 days after interview</li>
              <Spacer y={2} />
              <li>Funding will be reviewed periodically based on merit and performance</li>
              <Spacer y={2} />
              <li>
                Funding: Up to $10K for the first 60 days task. Additional funding based on merit 
                will not exceed $50K over a 12 month period (extensions may be granted on a case by case basis)
              </li>
              <Spacer y={2} />
              <li>
                Funds will be allocated to cover eligible expenses (including travel) and reimbursed to the co-founders 
                (current U of T students) upon presentation of original receipts (U of T procedures will apply)
              </li>
              <Spacer y={2} />
              <li>Funds will not be used for paying co-founders salaries or stipends of any sort</li>
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
      <Button href="/programs/utias/apply" as={Link} color="primary" size="lg">
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
