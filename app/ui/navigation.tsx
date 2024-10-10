"use client";

import { lusitana } from '@/app/ui/fonts';
import { useSession } from 'next-auth/react';
import React, {useEffect} from "react";
import {Accordion,AccordionItem, Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import Image from 'next/image';
import UserIcon from '@/app/ui/user-icon';
import PublicMobileSideNav from './dashboard/public-mobile-sidenav';

interface NavMenuItem {
  name: string;
  link: string;
  children: Array<{
      name: string;
      link: string;
      desc?: string;
  }>;
}

export const navMenuItems:NavMenuItem[] = [
  {name:'Programs', link:'', children:[
      {name:'NEST', link:'/programs/nest', desc:'Mentorship for UofT early-stage startups'},
      {name:'Launch Lab', link:'/programs/launch-lab', desc:'Support for research-based startups'},
      {name:'UTIAS', link:'/programs/utias', desc:'Mentorship for Aerospace startups'},
      {name:'Alumni', link:'/programs/alumni', desc:'Mentorship for Engineering Alumni startups'},
  ]},
  {name:'Engage', link:'', children:[
      {name:'Events', link:'/engage/events', desc:''},
      {name:'Ambassador', link:'/engage/ambassador', desc:''},
      {name:'Mentorship', link:'/engage/mentorship', desc:''},
      {name:'Investment Committee', link:'/engage/investment-committee', desc:''},
  ]},
  {name:'Build a team', link:'/services/build-a-team', children:[
      {name:'Looking for cofounders', link:'/services/build-a-team/looking-for-cofounders'},
      {name:'Looking for a startup', link:'/services/build-a-team/looking-for-a-startup'},
  ]},
  {name:'Share your problems', link:'/share-your-problems', children:[]},
  {name:'EMR', link:'/services/emr', children:[]},
];

export default function HatcheryNavigation() {
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    "Programs",
    "Engage",
    "Build A Team",
    "Share Your Problems",
    "EMR",
    "Login",
    "Logout",
  ];

  // Helper function to generate dropdown items for menus with children
  const generateDropdownItems = (children:any) => (
    <DropdownMenu aria-label="Actions" className="bg-white">
      {children.map((child:any) => (
        <DropdownItem key={child.name} href={child.link} description={child.desc}>
          {child.name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );

  return (
    <Navbar className="h-[4rem]" isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="full">

       <NavbarContent className="md:hidden" justify="start">
         <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
       </NavbarContent>
      {/* bg-red-200 */}
      <NavbarContent className="md:flex gap-4" justify="start">
        <NavbarBrand className="px-2 rounded-lg">
            <Link href="https://www.engineering.utoronto.ca">
                <Image
                    src="/uoft-fase.png"
                    width={175}
                    height={50}
                    className="md:block"
                    alt="Screenshots of the dashboard project showing desktop version"
                />
            </Link>
            <Link href="/">
                <Image
                    src="/hatchery-logo.png"
                    width={125}
                    height={50}
                    className="md:block"
                    alt="Screenshots of the dashboard project showing desktop version"
                />
            </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* bg-green-200 */}
      <NavbarContent className="hidden md:flex gap-4" justify="start">
        {/* Dynamically generate NavbarItems or Dropdowns based on navMenuItems */}
        {navMenuItems.map((item: any) => {
          const hasChildren = item.children && item.children.length > 0;
          return (
            <NavbarItem key={item.name}>
              {hasChildren ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Button disableRipple className="p-0 m-0 bg-transparent data-[hover=true]:bg-transparent text-sm" endContent="" radius="sm" variant="light">
                      {item.name}
                    </Button>
                  </DropdownTrigger>
                  {generateDropdownItems(item.children)}
                </Dropdown>
              ) : (
                <Button className="p-0 m-0 bg-transparent data-[hover=true]:bg-transparent text-sm">
                  <a href={item.link}>{item.name}</a>
                </Button>
              )}
            </NavbarItem>
          );
        })}

        {/* Add a separate NavbarItem for Sign In or UserIcon */}
        {session?.user ? (
          // Render UserIcon if there is a session
          <NavbarItem>
            <UserIcon session={session} />
          </NavbarItem>
        ) : (
          // Render Sign In button if there is no session
          <NavbarItem>
            <Button className="p-0 m-0 bg-transparent data-[hover=true]:bg-transparent text-sm">
              <a href="/signin">Sign In</a>
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Navigation SideBar */}
      <PublicMobileSideNav session={session}/>
    </Navbar>
  );

}
