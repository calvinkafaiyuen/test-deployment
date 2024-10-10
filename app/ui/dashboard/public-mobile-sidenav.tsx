import { Accordion, AccordionItem, NavbarMenu, NavbarItem, Link, Button, Spacer } from "@nextui-org/react";
import { AcademicCapIcon, UserGroupIcon, MegaphoneIcon, ChartBarIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/24/outline';
import { Session } from "next-auth"; // This might need adjustment based on your exact type imports
import { ArrowRightIcon } from '@heroicons/react/20/solid';

// Define the props type for Session
interface SessionProps {
    session: Session | null; // Assuming session can be null
}

interface NavMenuItem {
    name: string;
    link: string;
    children: Array<{
        name: string;
        link: string;
        desc?: string;
    }>;
}

// Mapping icons to the menu items
const iconMapping: any = {
  "Programs": AcademicCapIcon,
  "People": UserGroupIcon,
  "Evangelism": MegaphoneIcon,
  "Metrics": ChartBarIcon,
  "Resources": DocumentTextIcon,
  "Configurations": CogIcon,
};

// CSS classes for menu items
const itemClasses = {
  base: "py-0 w-full",
  title: "font-normal text-small",
  trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-8 flex items-center",
  indicator: "text-small",
  content: "text-small px-2",
};

// Mobile navigation menu items
const MobileNavMenuItems: NavMenuItem[] = [
    { name: 'Programs', link: '', children: [
        { name: 'NEST', link: '/programs/nest', desc: 'Mentorship for UofT early-stage startups' },
        { name: 'Launch Lab', link: '/programs/launch-lab', desc: 'Support for research-based startups' },
        { name: 'UTIAS', link: '/programs/utias', desc: 'Mentorship for Aerospace startups' },
        { name: 'Alumni', link: '/programs/alumni', desc: 'Mentorship for Engineering Alumni startups' },
    ]},
    { name: 'Engage', link: '', children: [
        { name: 'Events', link: '/engage/events', desc: '' },
        { name: 'Ambassador', link: '/engage/ambassador', desc: '' },
        { name: 'Mentorship', link: '/engage/mentorship', desc: '' },
        { name: 'Investment Committee', link: '/engage/investment-committee', desc: '' },
    ]},
    { name: 'Services', link: '', children: [
        { name: 'Build A Team', link: '/services/build-a-team' },
        { name: 'EMR', link: '/services/' },
        { name: '3D Printing', link: '/services/' },
    ]},
    { name: 'Events', link: '', children: [
        { name: 'Idea Market', link: '/services/idea-market' },
        { name: 'Speaker Series', link: '/services/speaker-series' },
        { name: 'Calendar', link: '/services/calendar' },
    ]},
];

export default function PublicMobileSideNav({ session }: SessionProps) {
  return (
    <NavbarMenu className="bg-white">
      {MobileNavMenuItems.map((item: any) => {
        const hasChildren = item.children && item.children.length > 0;
        return (
          <NavbarItem key={item.name}>
            {hasChildren ? (
              <Accordion>
                <AccordionItem key="1" aria-label={item.name} title={item.name} className="font-medium">
                  {item.children.map((child: any) => (
                    <a key={child.name} href={child.link} className="p-4 bg-transparent hover:bg-transparent w-full flex flex-col font-light">
                      {child.name}
                    </a>
                  ))}
                </AccordionItem>
              </Accordion>
            ) : (
              <Link className="p-0 bg-transparent hover:bg-transparent w-full" href={item.link} size="md" color="foreground">
                {item.name}
              </Link>
            )}
          </NavbarItem>
        );
      })}
      <Spacer y={6} />
      {!session?.user ? (
            <Button href="/signin" as={Link} color="primary" size="lg" className="w-1/2">Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /></Button>
            
        ) : (
            <div className="w-full flex flex-row ">
                <Button href="/redirect" as={Link} color="primary" size="lg" className="w-1/2 m-2">Dashboard</Button>
                <Button href="/signout" as={Link} color="danger" size="lg" className="w-1/2 m-2">Sign Out<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /></Button>
            </div>
      )}
    </NavbarMenu>
  );
}
