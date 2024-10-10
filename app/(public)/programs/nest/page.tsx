"use client"

import React from "react";
import { Divider, Card, CardHeader, CardBody, Accordion, AccordionItem, Link, Spacer, Image, Button } from "@nextui-org/react";

import HatcheryNavigation from '@/app/ui/navigation';

const Section1 = () => {
  return (
    <div className="px-8 py-16 flex flex-col items-center">
      <Image
        width={500}
        src="/programs/nest/nest-logo.png"
        alt="Nest Logo"
      />
      <Spacer y={6} />
      <p className="text-lg text-center">
        Fostering the creation of startups and the entrepreneurial mindset
      </p>
      <Spacer y={6} />
      <Button href="/programs/nest/apply" as={Link} color="primary" size="lg">
        Apply
      </Button>
    </div>
  );
}

const Section2 = () => {
  return (
    <div className="p-8 bg-slate-100">
      <p>
        Established in 2012, the Hatchery NEST is U of T engineering-based process, with more than 94 startups launched since its creation. 
        Hatchery NEST-born products and services include robotic exoskeletons to help provide physiotherapy to children with disabilities, 
        A.I. driven antibody search services to help researchers, and the reinvention of the Allan hex key. 
        One of the NEST’s most recent successes is Kepler Communications, which raised more than $20MM 
        in seed funding for its network of low-cost telecommunication cube satellites and recently launched its first model.
      </p>
      <Spacer y={6} />
      <p>
        But the Hatchery NEST is not just a place to develop startups – it is an experiential learning opportunity that instills 
        and nurtures the entrepreneurial mindset in all U of T students and faculty. In the Hatchery’s unique environment, 
        students experience the successes and failures of the entrepreneurial journey within a challenging yet supportive setting. 
        Co-founders are encouraged to embrace and overcome risk as a vital element of their journey, creating not only successful entrepreneurs, 
        but also the next generation of leaders as means of societal change.
      </p>
      <Spacer y={6} />
      <p className="font-bold">
        Application Deadline: Jan 31st
      </p>
    </div>
  );
}

const Section3 = () => {
  
  const evangelismTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">1. EVANGELISM</p>
      <p>
        Join us at over 40 events hosted each year to introduce students to entrepreneurship, the processes offered at the Hatchery, and potential co-founders.
      </p>
    </div>
  )
  
  const summerCohortTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">2. SUMMER COHORT</p>
      <p>
        Develop your business model, minimum viable product, and pitching skills from May to August under the guidance of your Advisory Board.
      </p>
    </div>
  )
  
  const demoDayTitle = (
    <div>
      <p className="text-2xl font-bold mb-2">3. DEMO DAY</p>
      <p>
        Make the final pitch on Demo Day, the culmination of the NEST process, for seed funding.
      </p>
    </div>
  )

  return (
    <div className="px-8 py-16">
      <p className="text-3xl font-bold text-center">OUR PROCESS</p>
      <Spacer y={6} />
      <Accordion>
        <AccordionItem className="py-6" key="1" aria-label="EVANGELISM" title={evangelismTitle}>
          <div>
            <p>
            Looking for inspiration, a startup idea, or a team? Join us at over 40 events hosted each year to introduce students to entrepreneurship, the processes offered at the Hatchery, and potential co-founders.
            </p>
            <Spacer y={2} />
            <Link href="#">SEE ALL OUR EVENTS HERE</Link>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="2" aria-label="SUMMER COHORT" title={summerCohortTitle}>
          <div>
            <p>
            Taking place from the beginning of May to end of August, teams will work with their Advisory Board of business 
            and technical mentors as well as Rotman MBA and UTM MMI (Master of Management and Innovation) students to 
            develop a business canvas model, cash-flow runway, minimum viable product (MVP), and undergo rigorous biweekly pitching rounds.
            </p>
            <Spacer y={6} />
            <p className="text-xl font-bold">
              WE PROVIDE
            </p>
            <Spacer y={6} />
            <div className="p-2 grid grid-cols-1 lg:grid-cols-4 gap-2">
              <Card className="p-2">
                <CardHeader className="flex flex-col items-center">
                  <Image
                    width={150}
                    height={150}
                    src="/programs/nest/owl.svg"
                    alt="Owl Image"
                  />
                </CardHeader>
                <Divider/>
                <CardBody>
                  <p className="font-bold my-2">ADVISORY BOARD</p>
                  <p>Mentorship from successful business and technical entrepreneurs, MBA students, and Masters of Management and Innovation (MMI) interns in compatible industries.</p>
                </CardBody>
              </Card>
              <Card className="p-2">
                <CardHeader className="flex flex-col items-center">
                  <Image
                    width={150}
                    height={150}
                    src="/programs/nest/funding.svg"
                    alt="Funding Image"
                  />
                </CardHeader>
                <Divider/>
                <CardBody>
                  <p className="font-bold my-2">PROTOTYPE FUND</p>
                  <p>From Amazon Web services to SolidWorks and microcontrollers, funding will be provided for relevant software and hardware needs.</p>
                </CardBody>
              </Card>
              <Card className="p-2">
                <CardHeader className="flex flex-col items-center">
                  <Image
                    width={150}
                    height={150}
                    src="/programs/nest/workspace.svg"
                    alt="Workspace Image"
                  />
                </CardHeader>
                <Divider/>
                <CardBody>
                  <p className="font-bold my-2">WORKSPACE</p>
                  <p>The spacious 6th floor in the new Centre for Engineering Innovation and Entrepreneurship (CEIE) will provide a suite of resources that help students translate their ideas and innovations into viable businesses.</p>
                </CardBody>
              </Card>
              <Card className="p-2">
                <CardHeader className="flex flex-col items-center">
                  <Image
                    width={150}
                    height={150}
                    src="/programs/nest/3dprinting.svg"
                    alt="3D Printing Image"
                  />
                </CardHeader>
                <Divider/>
                <CardBody>
                  <p className="font-bold my-2">3D PRINTING</p>
                  <p>Ultimakers, ProJets, CNC machines, laser-cutters, and other tools are available in our prototyping space, located on the 4th floor of the CEIE.</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem className="py-6" key="3" aria-label="DEMO DAY" title={demoDayTitle}>
          <div>
            <iframe className="aspect-video h-64" src="https://player.vimeo.com/video/240486135" />
            <Spacer y={6} />
            <p>
              Taking place at the beginning of September each year, teams have the opportunity to pitch their startups to a panel of entrepreneurs, investors and mentors on Demo Day.
            </p>
            <Spacer y={4} />
            <Button color="primary" >
              Learn More
            </Button>
          </div>
          <Spacer y={6} />
          <div>
            <p className="text-xl font-bold">
              WHAT&#34;S NEXT
            </p>
            <Spacer y={2} />
            <p>
            Teams will continue to receive support from the Hatchery in areas such as law, accounting, 
            and marketing until the team feels that they are ready to move on to another chapter of their entrepreneurship journey.
            </p>
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
        READY TO BUILD YOUR OWN STARTUP?
      </p>
      <Spacer y={6} />
      <Button href="/programs/nest/apply" as={Link} color="primary" size="lg">
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
