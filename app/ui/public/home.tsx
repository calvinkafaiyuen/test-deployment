'use client';
//bg-[url('/pattern.svg')]
import React, {useEffect} from "react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Card, CardHeader, CardFooter, CardBody, Avatar } from "@nextui-org/react";
import Image from 'next/image';

export default function HomeBody() {
    const testimonials = [1, 2, 3, 4];
    const events = [
        {name:"Speaker Series", date:"Tue.12PM-1PM", location:"Weekly @ MY370", link:"", img:"/events/speaker-series.png"},
        {name:"Idea Market",date:"Wed.12PM-2PM Thur.12PM-1PM", location:"Weekly @ MY620", link:"", img:"/events/idea-market.png"},
        {name:"Coffee", date:"TBA", location:"TBA", link:"", img:"/events/coffee-day.png"},
    ];
    const startupLogos = [
        '/aeroflux.png',
        '/amber-molecular.png',
        '/curovate.png',
        '/enginehire.png',
        '/enrich-bioscience.jpeg',
        '/forcen.png',
        '/genecis.jpeg',
        '/indus.jpeg',
        '/kepler.png',
        '/medchart.png',
        '/pheedloop.png',
        '/phycus.png',
        '/spinoza.png',
        '/trexo-robotics.png',
        '/vincilabs.png',
        '/xpan.jpeg',
    ];
    return (
        <div id="home-body-container">
            <div id="home-1" className=" bg-[url('/pattern.svg')] animate-levitate-6s flex flex-col lg:flex-row w-full justify-center content-center p-6
                z-0 opacity-0 overflow-hidden data-[mounted=true]:opacity-100 transition-opacity bg-left bg-no-repeat after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:bg-gradient-to-r after:from-transparent after:to-background dark:after:to-black after:z-[-1]" data-mounted="true">
                <section className="flex flex-col w-1/2 w-full justify-center content-center">
                    <div className="text-center leading-8 md:leading-10 md:text-left">
                        <div className="inline-block">
                            <h1 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">We&nbsp;</h1>
                            <h1 className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8] text-[2.1rem] lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b">create&nbsp;</h1>
                        </div>
                        <h1 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">startups and entrepreneurial human capital.</h1>
                    </div>
                    <h2 className="w-full md:w-1/2 my-2 text-lg lg:text-xl font-normal text-default-500 block max-w-full !w-full text-center md:text-left">
                        Making an <span className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8]  bg-clip-text text-transparent bg-gradient-to-b">impact! &nbsp;</span>
                        A decade of the Hatchery.</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <a className="p-2 z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-6 min-w-unit-24 h-unit-12 text-medium gap-unit-3 rounded-full [&amp;>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover w-full md:w-auto" role="button" href="/docs/guide/introduction">
                            Check it out
                            <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform">
                                <path d="M16.835 6.91821L23.9166 13.9999L16.835 21.0815" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></path>
                                <path d="M4.08325 14H23.7183" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"></path>
                            </svg>
                        </a>
                    </div>
                </section>
                <section className="flex w-1/2 w-full justify-center content-center">
                    <Image
                        priority
                        src="/startup-rocket.svg"
                        width={800}
                        height={800}
                        className="block animate-levitate"
                        alt="Startup Rocket"
                    />
                </section>
            </div>

            <div id="home-2" className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
                    <div className="flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0">
                        <p className="text-base font-semibold">Create a Startup</p>
                    </div>
                    <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
                        <p className="font-normal text-base text-default-500">We help you take your ideas and launch them into successful startups through our programs.</p>
                    </div>
                </div>
                <div className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
                    <div className="flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0">
                        <p className="text-base font-semibold">Build a Team</p>
                    </div>
                    <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
                        <p className="font-normal text-base text-default-500">We help you find your co-founders based on the skills and needs that you submit in our application form.</p>
                    </div>
                </div>
                <div className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
                    <div className="flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0">
                        <p className="text-base font-semibold">Business Ideation</p>
                    </div>
                    <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
                        <p className="font-normal text-base text-default-500">Do you have a problem that needs a solution? Share them online at Share Your Problems or in-person at Idea Market.</p>
                    </div>
                </div>
                <div className="flex flex-col relative overflow-hidden height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none border-transparent bg-white/5 dark:bg-default-400/10 backdrop-blur-lg backdrop-saturate-[1.8]">
                    <div className="flex p-3 z-10 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large gap-2 pb-0">
                        <p className="text-base font-semibold">Idea Market</p>
                    </div>
                    <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
                        <p className="font-normal text-base text-default-500">Discuss and innovate with fellow entrepreneurs to solve real industry problems, share ideas, and potentially meet your future team.</p>
                    </div>
                </div>
            </div>

            <div id="home-2" className="mt-6 flex flex-col lg:flex-row w-full justify-center content-center p-6
                z-0">
                <section className="relative z-10 flex flex-col gap-2 w-full text-center mt-2">
                    <h3 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl"><span className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8]  bg-clip-text text-transparent bg-gradient-to-b">100+&nbsp;</span>Startups launched!</h3>
                </section>
            </div>


            <div id="home-3" className="bg-slate-50 flex flex-col lg:flex-row w-full justify-center content-center py-24 px-6
                z-0 opacity-0 overflow-hidden data-[mounted=true]:opacity-100 transition-opacity bg-left bg-no-repeat after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:bg-gradient-to-r after:from-transparent after:to-background dark:after:to-black after:z-[-1]" data-mounted="true">
                <section className="flex flex-col w-1/2 w-full justify-center content-center">
                    <div className="text-center leading-8 md:leading-10 md:text-left">
                        <div className="inline-block">
                            <h1 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">Want to&nbsp;</h1>
                            <h1 className="tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] text-3xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b">develop&nbsp;</h1>
                        </div>
                        <h1 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">on your startup?</h1>
                    </div>
                    <h2 className="w-full md:w-1/2 my-2 text-lg lg:text-xl font-normal text-default-500 block max-w-full !w-full text-center md:text-left">
                        Do not wait! <span className="tracking-tight inline font-semibold from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent bg-gradient-to-b">Apply right now&nbsp;</span>to one of our programs.
                    </h2>
                </section>
                <section className="flex w-full justify-center content-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                        <Link><Image
                            priority
                            src="/nest-logo.png"
                            width={250}
                            height={250}
                            className="block m-2"
                            alt="NEST"
                        /></Link>
                        <Link><Image
                            priority
                            src="/launchlab-logo.png"
                            width={250}
                            height={250}
                            className="block m-2"
                            alt="Launch Lab"
                        /></Link>
                        <Link><Image
                            priority
                            src="/utias-logo.png"
                            width={250}
                            height={250}
                            className="block m-2"
                            alt="UTIAS"
                        /></Link>
                        <Link><Image
                            priority
                            src="/alumni-logo.png"
                            width={250}
                            height={250}
                            className="block m-2"
                            alt="Alumni"
                        /></Link>
                    </div>
                </section>
            </div>

            <div id="home-4" className="mt-6 flex flex-col w-full justify-center content-center py-24 px-6
                z-0">
                <section className="relative z-10 flex flex-col gap-2 w-full text-center mt-2">
                    <h3 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">Success Stories</h3>
                </section>
                <section className="mt-6 grid grid-4 grid-cols-4 gap-4 gap-y-8 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {startupLogos.map((logo, index) => (
                        <div className="m-2 m-auto bg-white" key={index}>
                            <Image
                                priority
                                src={`/startups${logo}`}
                                width={70}
                                height={50}
                                className="m-auto m-2"
                                alt="Startup"
                            />
                        </div>
                    ))}
                </section>
            </div>

            <div id="home-5" className="justify-center bg-slate-50 flex flex-col w-full justify-center content-center py-24 px-6
                z-0">
                <section className="relative z-10 flex flex-col gap-2 w-full text-center mt-2 mb-12">
                    <h3 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">Engage With Us</h3>
                </section>
                <section className="justify-center relative z-10 flex flex-col md:flex-row  gap-2 w-full text-center mt-2">
                    {events.map((event, index) => (
                        <Card className="py-4 mx-2" key={index}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">{event.location}</p>
                                <small className="text-default-500">{event.date}</small>
                                <h4 className="font-bold text-large">{event.name}</h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2 justify-between hidden md:flex">
                                <Button className="rounded-3xl" color="primary" variant="flat">Learn more</Button>
                                <Image
                                alt={event.name}
                                className="object-cover m-auto p-2"
                                src={event.img}
                                height={200}
                                width={200}
                                />
                            </CardBody>
                        </Card>
                    ))}
                </section>
            </div>

            <div id="home-6" className="flex flex-col w-full justify-center content-center p-6 py-24 px-6
                z-0">
                <section className="relative z-10 flex flex-col gap-2 w-full text-center mt-2 mb-12">
                    <h3 className="tracking-tight inline font-semibold text-[2.1rem] lg:text-5xl">Testimonials</h3>
                </section>
                <section className="
                    z-10 flex flex-col justify-center items-center w-full text-center mt-2
                    grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4
                ">
                {testimonials.map((card, index) => (
                    <Card className="max-w-[340px]" key={index}>
                        <CardHeader className="justify-between">
                            <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="/wen-cheng-chong.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">Wen Cheng Chong</h4>
                                <h5 className="text-small tracking-tight text-default-400">Co-founder and Chief Technologist</h5>
                            </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-3 py-0 text-small text-default-400">
                            <p>
                            When I look back, I see The Hatchery as the tipping point for me because I quit my job and threw myself into Kepler full-time. The program provided exactly the right environment for us to grow as we were first developing our product.
                            </p>
                        </CardBody>
                        <CardFooter className="gap-3">
                            <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">@</p>
                            <p className=" text-default-400 text-small">Kepler Communications</p>
                            </div>
                        </CardFooter>
                    </Card>
                    ))}
                </section>
            </div>

            <div id="home-7" className="bg-slate-50 flex flex-col lg:flex-row w-full justify-center content-center p-6 md:px-24
                z-0">
                <section className="relative z-10 flex flex-col w-full text-center h-96">
                        <iframe src="https://player.vimeo.com/video/752755774?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" className="h-full  w-full" allow="autoplay; fullscreen; picture-in-picture" title="DEMO DAY 2022"></iframe>
                </section>
            </div>

            <div id="home-x" className="flex flex-col lg:flex-row w-full justify-center content-center p-6
                z-0">
                <section className="relative z-10 flex flex-col gap-2 w-full text-center mt-2">

                </section>
            </div>
        </div>
    );
}
