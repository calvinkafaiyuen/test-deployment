"use client"

import React from "react";
import { Link, Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <p className="text-5xl text-center font-bold">
        3D PRINTING SERVICES
      </p>
      <Spacer y={12} />
      <Image
        width={500}
        src="/services/3d-printing/3d-printing-logo.png"
        alt="3D Printing Logo"
      />
      <Spacer y={12} />
      <p className="text-lg text-center">
        Want to see your idea come to life? Print out a 3D prototype of your design with the Hatchery!
      </p>
      <Spacer y={6} />
      <Button color="primary" size="lg">
        Apply
      </Button>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="px-8 py-16 bg-slate-100">
      <p className="text-3xl font-bold text-center">WHAT YOU&#34;LL NEED</p>
      <Spacer y={12} />
      <div className="flex flex-col lg:flex-row items-center">
        <div className="flex flex-col items-center">
          <Image
            className="max-h-40"
            src="/services/3d-printing/stl.png"
            alt="STL"
          />
          <Spacer y={6} />
          <div className="text-center">
            <p>An STL file of your 3D design</p>
            <Spacer y={2} />
            <p>Note: You must be enrolled at UofT OR be a part of the Hatchery</p>
          </div>
        </div>
        <Spacer x={4} />
        <p className="text-8xl">+</p>
        <Spacer x={4} />
        <div className="flex items-center">
          <p className="text-9xl scale-y-100">(</p>
          <Spacer x={6} />
          <div className="flex flex-col items-center">
            <Image
              className="max-h-48"
              src="/services/3d-printing/student.png"
              alt="Student"
            />
            <Spacer y={4} />
            <p className="text-center">To be enrolled at UofT</p>
          </div>
          <Spacer x={6} />
          <p className="text-4xl font-bold">OR</p>
          <Spacer x={6} />
          <div className="flex flex-col items-center">
            <Image
              className="max-h-48"
              src="/services/3d-printing/team.png"
              alt="Team"
            />
            <Spacer y={4} />
            <p className="text-center">Be a part of the Hatchery</p>
          </div>
          <Spacer x={6} />
          <p className="text-9xl scale-y-100">)</p>
        </div>
      </div>
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="px-8 py-16">
      <p className="text-3xl font-bold text-center">HOW TO PICK UP YOUR FINISHED PRODUCT</p>
      <Spacer y={12} />
      <div className="flex flex-col lg:flex-row items-center">
        <div className="flex flex-col items-center">
          <Image
            className="max-h-48"
            src="/services/3d-printing/calendar.png"
            alt="Calendar"
          />
          <Spacer y={6} />
          <p className="text-center">Depending on demand, your print could take up to 7 days to complete</p>
        </div>
        <Spacer x={4} />
        <Image
          className="h-48 lg:h-auto rotate-90 lg:rotate-0"
          src="/services/3d-printing/arrow.png"
          alt="Arrow"
        />
        <Spacer x={4} />
        <div className="flex flex-col items-center">
          <Image
            className="max-h-48"
            src="/services/3d-printing/connector.png"
            alt="Connector"
          />
          <Spacer y={6} />
          <p className="text-center">A Hatchery connector will get in touch with you once your print is ready for pick up.</p>
        </div>
        <Spacer x={4} />
        <Image
          className="h-48 lg:h-auto rotate-90 lg:rotate-0"
          src="/services/3d-printing/arrow.png"
          alt="Arrow"
        />
        <Spacer x={4} />
        <div className="flex flex-col items-center">
          <Image
            className="max-h-48"
            src="/services/3d-printing/myhal.png"
            alt="Myhal"
          />
          <Spacer y={6} />
          <p className="text-center">Your finished product will be available for pick up at the Hatchery office located in the Myhal building.</p>
        </div>
      </div>
    </div>
  )
}

const Section4 = () => {
  return (
    <div className="px-8 py-16 bg-slate-100">
      <p className="text-3xl font-bold text-center">OUR PRINTERS</p>
      <Spacer y={12} />
      <div className="flex justify-center">
        <Image
          width={500}
          src="/services/3d-printing/ultimaker.png"
          alt="Ultimaker"
        />
      </div>
      <Spacer y={12} />
      <div>
        <p className="text-xl font-bold">Ultimaker 2</p>
        <Spacer y={6} />
        <p>
          The Ultimaker 2 is designed to create the most effortless and enjoyable 3D printing experience ever. 
          With ground-breaking 20 micron definition and near silent operation, it’s a leap forward in accurate 3D printing.
        </p>
        <Spacer y={4} />
        <p>
          The material it supports is PLA White, a bioplastic which transitions quickly from liquid to solid. 
          The machine has a generous build area of 223 by 223 by 205 mm. Due to the limitations, we encourage to you use the Ultimaker 2 for prototype printing.
        </p>
        <Spacer y={4} />
        <p>
          To learn more about the details of the machine, please <Link href="#">click here</Link>.
        </p>
      </div>
    </div>
  )
}

const Section5 = () => {
  return (
    <div className="px-8 py-16">
      <p className="text-3xl font-bold text-center">FREQUENTLY ASKED QUESTIONS</p>
      <Spacer y={12} />
      <p className="text-xl font-bold">How long will the print take?</p>
      <Spacer y={1} />
      <p>
        The print time depends on the size of the part. 
        Small parts can take only a few hours whereas very large and bulky parts will take at least a day. 
        Infill density also greatly affects the print time.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">What is meant by “infill density”?</p>
      <Spacer y={1} />
      <p>
        Parts are not printed to be completely solid. The infill is how much of the space inside the part is filled with material. 
        100% infill is completely solid, while 0% is completely hollow. 20% is the standard infill density. 
        don’t typically print at 100% unless absolutely necessary.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">Can I print in a specific colour?</p>
      <Spacer y={1} />
      <p>
        Currently, we only stock white PLA. We also cannot accept any other rolls of material provided to us by clients.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">Can I print in a material other than PLA?</p>
      <Spacer y={1} />
      <p>
        No. The Ultimakers are designed for various materials, but we only keep PLA as we do not have the necessary ventilation for other materials.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">Can you make changes to my part?</p>
      <Spacer y={1} />
      <p>
        We can scale parts, but we cannot change the smaller details and dimensions.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">What settings do I need to get the strongest part?</p>
      <Spacer y={1} />
      <p>
        Infill density is the setting that determines how strong a part is. 
        A completely solid part will be the most durable . 
        However, we recommend that you determine how strong it needs to be first before requesting 100% infill 
        as this can result unnecessary usage of material. Another option is to keep the infill density lower, 
        but increase the wall thickness.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">What is the resolution of the Ultimakers?</p>
      <Spacer y={1} />
      <p>
        The printer can be accurate to 12.5 microns (X direction), 
        12.5 microns (Y direction) and 5 microns (Z direction). 
        For more information on the resolution of the Ultimaker, please click here.
      </p>
      <Spacer y={8} />
      <p className="text-xl font-bold">What is the build volume for the Ultimakers?</p>
      <Spacer y={1} />
      <p>
        The build volume is 223 by 223 by 205 mm. 
        However, parts that are close to these dimensions are more difficult to print and may not turn out as well.
      </p>
      <Spacer y={8} />
    </div>
  )
}

const Section6 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center bg-slate-100">
      <p className="text-3xl font-bold">
        CONTACT
      </p>
      <Spacer y={6} />
      <p className="text-xl">
        For more questions/inquiries, please email: 3d@uofthatchery.ca.
      </p>
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
      <Section5 />
      <Section6 />
    </main>
  );
}
