"use client"

import React, { useState } from "react";
import { useDisclosure, Card, CardBody, CardHeader, Divider, Link, Spacer, Image, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

// EMRData profile pictures are fetched from /services/emr/firstname_lastname.jpg

const EMRData = [
  {
    name: "Isi Caulder",
    title: "IP Strategy",
    text: [`Isi Caulder is a partner, lawyer and patent agent with Bereskin & Parr LLP here in Toronto. 
            She is the co-leader of the firm’s Artificial Intelligence (AI) practice group and helps technology 
            clients build patent portfolios for a wide variety of electrical, computer and mechanical related inventions. 
            She is a frequent speaker and supporter of the Toronto technology community, mentoring student start up teams 
            at The Entrepreneurship Hatchery and the IMPACT Centre at UofT. She is also an involved board member on the 
            UofT Engineering Alumni Network (EAN) Board and the UofT EAN Awards committee. Isi is listed in the 
            2020 Canadian Lexpert Directory as a “Most Frequently Recommended” lawyer in Canada and is listed in 
            2021 Best Lawyers in Canada.`]
  },
  {
    name: "Scott Pelton",
    title: "Investment Strategy",
    text: ["20 years venture capital experience",
           "- Investing since July 2000, over 50 investments",
           "- Founding partner Round13, MaRS IAF, Growthworks, Scotiabank PE",
           "- Deep full-stack technical background",
           "- Strongest returns have been from early stage information technology firms,",
           "- BEng. Mgt. (Computer Engineering with business option) from McMaster 1995, active volunteer in IEEE, student council, etc.",
           "- Loves skiing, electric cars and craft beer",
           "- Deep Experience in traditional industry investing such as retail, consumer packaged goods, oil and gas"]
  },
  {
    name: "Priya Vijay",
    title: "Hardware",
    text: [`Priya has over 15 years of experience creating and implementing global product strategy in Fortune 100, 
            mid-cap and start-ups. She has successfully built and commercialized highly technical hardware and 
            software product solutions through direct sales & channel partners.  Priya was the VP of Product & Marketing 
            at two IoT start- ups, Cloudleaf & AeroScout Industrial (acquired by Stanley Black & Decker). 
            Priya has also held multiple product and engineering leadership roles at GE Energy & Pratt & Whitney. 
            She has a BS in Chemical Engineering from the University of Toronto and lives in San Francisco, CA.`]
  },
  {
    name: "Ryan Gilliam",
    title: "Investment Strategy / Chemical and Materials",
    text: [`Dr. Ryan Gilliam is a Venture Partner at 1955 Capital where he is focused on energy, sustainability, 
            waste upcycling, materials innovations, and emerging technologies. As a serial entrepreneur in the sustainability field, 
            Ryan has developed technologies for the beneficial reuse of carbon emissions, industrial waste reutilization, 
            and production of building materials and chemicals.`,
           `In addition to serving as a Venture Partner at 1955 Capital, Ryan is the CEO and founder of 
            two venture-funded start-up companies. The first, Fortera Corporation, is focused on the beneficial 
            reuse of CO2 to produce a range of building material products that both directly capture and offset CO2 emissions. 
            The second, Chemetry Corporation, is an industrial chemicals platform company redefining how commodity chemicals are made. 
            Within these two companies and industrial areas, Ryan has successfully driven industrial scale-up of multiple technologies, 
            a business development program resulting in strategic partnerships with Fortune 500 chemicals and engineering companies, 
            commercialization efforts which led to an active presence in global markets, the development of a smart parts platform 
            and set of enabling strategic supply agreements, and the building of teams consisting of world-class technical and business talent.`,
           `Ryan obtained his Ph.D. and engineering undergraduate degree from the University of Toronto in Materials Science and Engineering. 
           Ryan has 10+ peer-reviewed publications, been an invited speaker at multiple international conferences, and is an inventor on 
           90+ patents in the energy, sustainability, products and materials spaces.`]
  },
  {
    name: "Naresh Bangia",
    title: "First Sales Pitch B2B / Software",
    text: [`Mr. Naresh Bangia was the Founder and President of AJB Software Design. 
            AJB Software started in 1994 as a middleware provider software. 
            The software integrated the POS vendor software with the Pin Pad hardware and the customer’s 
            chosen payment authorizers. AJB specialized in B2B sales since the company customers were the top 25 retailers in North America. 
            On average the company worked on over 300 projects a year with a staff of 160 people all located in Toronto. 
            To accomplish this task, the company deployed lean manufacturing processes to the delivery of software projects. 
            AJB was bootstrapped from the very beginning and remained that way to the very end when it was finally sold to Verifone in early 2016. 
            Because of its boot strapped roots, the company became very focused on how to close sales quicker every year and 
            delivery projects faster every year, that was a key goal of the company while maintaining its EBITDA.`]
  },
  {
    name: "Christine Tovee",
    title: "Aerospace",
    text: [`Christine Tovee has over 15 years of engineering and technology experience in the aerospace and defence sectors. 
            After graduating from University of Toronto Engineering Science Program, she completed her Master’s degree at MIT 
            developing a virtual reality experiment aboard NASA’s Neurolab mission.  She has worked both in North America and 
            Europe predominantly for BAE SYSTEMS and Airbus Group (formerly EADS).  She has engineering project experience 
            spanning both military and civilian aircraft, helicopters, UAVs and satellites.  She left Airbus Group in 2015 
            as the Chief Technology Officer for the North American division overseeing all research and development in Canada and the USA. 
            She is a member of Canada’s Space Advisory Board and the Department of National Defence’s Independent Review Panel for Defence Acquisition. 
            She now consults with emerging ventures on accelerating technology and scaling innovation.`]
  },
  {
    name: "Ian Mcwalter",
    title: "Computer Engineering, Software / Hardware",
    text: [`Dr. Ian McWalter has over 40 years of leadership and managerial experience in the semiconductor and 
            electronics industry in both hardware and software. Dr. McWalter was recently CEO of CMC Microsystems, 
            spent 15 years at Gennum Corporation, including five years as President and CEO and held a number of 
            management positions with Bell Northern Research. Dr. McWalter currently sits on the Board of Directors of 
            Evertz Technologies, and is Chairman of GaN Systems . Dr. McWalter received his BSc (Honours) Physics in 1972 
            and his PhD Electrical Engineering in 1977 from Imperial College.`]
  },
  {
    name: "Jen Flexman",
    title: "MedTech",
    text: [`Jen brings nearly two decades of experience in healthcare and the life sciences. 
            She is currently the Head of Business Development at Thrive Health, a technology company focused 
            on improving the delivery of healthcare in Canada. She has held national senior leadership roles 
            in strategy and business development at Babylon Health and LifeLabs, Canada’s largest medical laboratory. 
            She has also advised governments on innovation policy, including as a Fellow at the National Academies in Washington, DC. 
            She has an MBA from the Rotman School of Management at the University of Toronto, a PhD in bioengineering from the 
            University of Washington in Seattle, and a BEng in electrical engineering from McGill University.`]
  },
  {
    name: "Colin Webster",
    title: "Investment Strategy",
    text: [`Colin Webster is serial entrepreneur and investor. Founder of many companies such as 
            reBOOT Canada, Truition, First Coverage, Jatheon, Dos Cielos, Hero Ventures and RiSC Capital and 
            first investor in Well.ca, Visualase, Medchart, HomeAway, Antibe Thera, Hol Fool and Xmatic. 
            He has been awarded the Golden Jubilee Medal from the Queen for his non-profit work and and 
            2 patents on sport glasses tech. He graduated from Princeton University in 1988 in Electrical Engineering 
            and recently completed a Machine Learning course from Stanford University.  
            He has deep experience in AI, E- Commerce, blockchain, software and med-tech devices. 
            Currently, Colin Webster runs a seed stage Deep Tech Venture Capital fund in Toronto called RiSC Capital.`]
  },
  {
    name: "George Babu",
    title: "Artificial Intelligence",
    text: [`I’ve had a lifelong fascination with technology’s impact on our lives, iconic products that once seemed like SciFi, 
            and the small early teams that overcome seemingly insurmountable odds to bring new products & technologies to billions of people. 
            Through a variety of roles at several companies and funds, I’ve been able to explore how to spot promising emerging technologies, 
            bring people and capital together to productize the tech, figure out how to bring them to market, and finally, 
            how to build defensible moats around all this (hint: profits & patents)!`,
           `I now help founders with all aspects of go-to-market for deep tech based products: customer development, 
            prototyping, product definitions, pricing, selling, pitching…and so much more! Early stage companies are messy. 
            Early stage deep tech companies are messier still. But I’m convinced it’s worth navigating this mess to make real 
            the potential that these technologies have to improve our everyday lives. My job at SEV is to help founders see through the fog, 
            tackle the FUD, and bring their visions to life.`]
  }
]

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        className="rounded-none"
        width={800}
        src="/services/emr/emr.png"
        alt="3D Printing Logo"
      />
      <Spacer y={8} />
      <p className="text-2xl font-bold text-center text-slate-600 uppercase">
        Entrepreneur mentors in residence
      </p>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 bg-slate-100">
      <p>
        The Hatchery Entrepreneur Mentors In Residence (EMR) gives cofounders the opportunity 
        to discuss business ideas on a one-on-one basis with Subject Matter Experts. 
        Follow these four simple steps to get started:
      </p>
      <Spacer y={6} />
      <p>
        Step 1: Click on one of the EMRs below
      </p>
      <p>
        Step 2: Provide us with your information
      </p>
      <p>
        Step 3: Share the questions you would like to ask them
      </p>
      <p>
        Step 4: You will receive an introductory email from the Hatchery
      </p>
      <Spacer y={6} />
      <p>
        Applicants will have the opportunity to have a sounding board as they prepare 
        to apply to the Hatchery programs. The Hatchery EMRs will not engage in any 
        direct partnerships, investment, developments, or financing of the startup. 
        At this time, eligible applicants must be current University of Toronto graduate students and/or faculty.
      </p>
    </div>
  )
}

const Section3 = () => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const setSelectedCard = (index: number) => {
    setSelectedCardIndex(index);
    onOpen();
  }

  return (
    <>
      <div className="px-8 py-16">
        <p className="text-3xl font-bold text-center">OUR EMRs</p>
        <Spacer y={12} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {EMRData.map((card, index) => (
            <Card 
              key={index}
              className="p-2 hover:bg-slate-100"
              isPressable
              onClick={() => setSelectedCard(index)}
            >
              <CardHeader className="flex flex-col items-center my-2">
                <Image
                  width={150}
                  height={150}
                  src={`/services/emr/${card.name.split(" ").join("_").toLowerCase()}.jpg`}
                  alt={"EMR Picture of " + card.name}
                />
              </CardHeader>
              <Divider/>
              <CardBody className="text-center">
                <p className="text-2xl mb-2">{card.name}</p>
                <p className="font-bold">{card.title}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"xl"} scrollBehavior={"inside"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{EMRData[selectedCardIndex].name}</ModalHeader>
              <ModalBody>
                {EMRData[selectedCardIndex].text?.map((text, line) => (
                  <p key="line">
                    {text}
                  </p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  ASK {EMRData[selectedCardIndex].name}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Page() {

  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section1 />
      <Section2 />
      <Section3 />
    </main>
  );
}
