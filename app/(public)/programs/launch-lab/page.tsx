"use client"

import React from "react";
import { Card, CardHeader, CardBody, Spacer, Image, Button, Link } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/programs/launch-lab/ll-logo.png"
        alt="Launch Lab Logo"
      />
      <Spacer y={6} />
      <p className="text-lg text-center">
        Enabling graduate- and faculty-level research-driven startup companies
      </p>
      <Spacer y={6} />
      <Button href="/programs/launch-lab/apply" as={Link} color="primary" size="lg">
        Apply
      </Button>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 bg-slate-100">
      <p>
        The Hatchery Launch Lab provides support for graduate student- and faculty-level research-based startups. 
        Teams benefit from a process whereby a strong advisory board helps them define a business model, 
        determine financial projections, and hone an investor-ready pitch. 
        The Hatchery’s enriched support includes mentorship and guidance from established entrepreneurs in relevant sectors, 
        counsel, accounting and marketing services.
      </p>
      <Spacer y={6} />
      <p>
        The goal of this stream is to enable teams to sustain themselves while they complete the steps necessary to 
        define a business model for their technology and attract investment.
      </p>
    </div>
  );
}

const Section3 = () => {
  return (
    <div className="px-8 py-16">
      <p className="text-3xl font-bold">ELIGIBILITY</p>
      <Spacer y={6} />
      <ul className="ml-10 list-disc">
        <li>Masters, PhDs, Postdocs</li>
        <li>Graduate Program Alumni within 2 years of graduation</li>
        <li>Rotman MBA students with Engineering backgrounds</li>
        <li>Faculty</li>
      </ul>
      <Spacer y={12} />
      <p className="text-3xl font-bold">WHAT DOES A LAUNCH LAB TEAM GET?</p>
      <Spacer y={6} />
      <div className="p-2 grid grid-cols-1 lg:grid-cols-4 gap-2">
        <Card className="p-2">
          <CardHeader className="flex flex-col items-center">
            <Image
              width={150}
              height={150}
              src="/programs/launch-lab/owl.svg"
              alt="Owl Image"
            />
          </CardHeader>
          <CardBody>
            <p className="font-bold text-center">ADVISORY BOARD</p>
          </CardBody>
        </Card>
        <Card className="p-2">
          <CardHeader className="flex flex-col items-center">
            <Image
              width={150}
              height={150}
              src="/programs/launch-lab/businessmodeldev.svg"
              alt="Business Model Dev Image"
            />
            </CardHeader>
          <CardBody>
            <p className="font-bold text-center">BUSINESS MODEL DEVELOPMENT</p>
          </CardBody>
        </Card>
        <Card className="p-2">
          <CardHeader className="flex flex-col items-center">
            <Image
              width={150}
              height={150}
              src="/programs/launch-lab/funding.svg"
              alt="Funding Image"
            />
          </CardHeader>
          <CardBody>
            <p className="font-bold text-center">FUNDING</p>
          </CardBody>
        </Card>
        <Card className="p-2">
          <CardHeader className="flex flex-col items-center">
            <Image
              width={150}
              height={150}
              src="/programs/launch-lab/services.svg"
              alt="Services Image"
            />
          </CardHeader>
          <CardBody>
            <p className="font-bold text-center">HATCHERY SERVICES</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

const Section4 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center bg-slate-100">
      <p className="text-3xl font-bold">
        MEET ALL REQUIREMENTS?
      </p>
      <Spacer y={6} />
      <p className="text-xl">
        Applications Open Year Round
      </p>
      <Spacer y={6} />
      <Button href="/programs/launch-lab/apply" as={Link} color="primary" size="lg">
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
