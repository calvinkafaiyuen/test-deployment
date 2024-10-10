"use client";
import { lusitana } from '@/app/ui/fonts';
import React from 'react';
import { Link } from '@nextui-org/react';
// import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
type FooterColumn = {
    title: string;
    links: { name: string; href: string }[];
};

const footerColumns: FooterColumn[] = [
    {
        title: 'Programs',
        links: [
            { name: 'NEST', href: '/programs/nest' },
            { name: 'Launch Lab', href: '/programs/launch-lab' },
            { name: 'UTIAS', href: '/programs/utias' },
            { name: 'Alumni', href: '/programs/alumni' },
        ],
    },
    {
        title: 'Engage',
        links: [
            { name: 'Events', href: '/engage/events' },
            { name: 'Ambassador', href: '/engage/ambassador' },
            { name: 'Mentorship', href: '/engage/mentorship' },
            { name: 'Investment Committee', href: '/engage/investment-committee' },
        ],
    },
    {
        title: 'Services',
        links: [
            { name: '3D Printing', href: '/services/3d-printing' },
            { name: 'Build A Team', href: '/build-a-team' },
            { name: 'Prototype Funding', href: '/services/protoype-funding' },
            { name: 'Work Space', href: '/servicse/work-space' },
            { name: 'EMR', href: '/services/emr' },
        ],
    },
    {
        title: 'Events',
        links: [
            { name: 'Accelerator Weekend', href: '/events/accelerator-weekend' },
            { name: 'Co-founders Day', href: '/events/cofounders-day' },
            { name: 'Demo Day', href: '/events/demo-day' },
            { name: 'Idea Market', href: '/events/idea-market' },
            { name: 'Speaker Series', href: '/events/speaker-series' },
            { name: 'Calendar', href: '/events/calendar' },
        ],
    },
    {
      title: 'About Us',
      links: [
          { name: 'Hatchery', href: '/about-us/hatchery' },
          { name: 'Contact', href: '/about-us/contact' },
          { name: 'Mentors', href: '/about-us/mentors' },
          { name: 'our-startups', href: '/about-us/our-startups' },
          { name: 'Self-Care', href: '/about-us/self-care' },
          { name: 'Student Data Practices', href: '/about-us/student-data-practices' },
          { name: 'UofT Home', href: '/about-us/uoft-home' },
          { name: 'Faculty Home', href: '/about-us/faculty-home' },
      ],
  },
];

const HatcheryFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-white dark:bg-gray-900">
            <hr></hr>
            <div className="mx-auto w-full max-w-screen-xl">
                <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-5">
                    {footerColumns.map((column, index) => (
                        <div key={index}>
                            <h2 className="mb-6 text-xs font-semibold text-gray-900 uppercase dark:text-white">{column.title}</h2>
                            <ul className="text-black dark:text-gray-800 font-small">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="mb-4 text-xs">
                                        <a href={link.href} className="hover:underline text-xs">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <hr></hr>
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-black sm:text-center dark:text-gray-400">© {currentYear} <a href="" className="hover:underline">The Entrepreneurship Hatchery</a>. All Rights Reserved.
              </span>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black dark:text-gray-400 sm:mt-0">
                  <li>
                      <a href="#" className="hover:underline me-4 md:me-6 text-xs">Terms and Conditions</a>
                  </li>
              </ul>
            </div>
        </footer>
    );
};

export default HatcheryFooter;
