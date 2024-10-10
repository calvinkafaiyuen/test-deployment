"use client";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Link, Accordion, AccordionItem, Image } from "@nextui-org/react";
import { Bars2Icon, XMarkIcon, PowerIcon, AcademicCapIcon, UserGroupIcon, MegaphoneIcon, ChartBarIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/24/outline';
const iconMapping:any = {
  "Programs": AcademicCapIcon,
  "People": UserGroupIcon,
  "Evangelism": MegaphoneIcon,
  "Metrics": ChartBarIcon,
  "Resources": DocumentTextIcon,
  "Configurations": CogIcon,
};

const itemClasses = {
  base: "py-0 w-full",
  title: "font-normal text-small",
  trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-8 flex items-center",
  indicator: "text-small",
  content: "text-small px-2",
};

const menuData = [{
  "Programs": {
    "NEST":"/admin/programs/nest",
    "Launch Lab":"/admin/programs/launch-lab",
    "UTIAS":"/admin/programs/utias",
    "Alumni":"/admin/programs/alumni",
    "Go To Market":"/admin/programs/go-to-market",
    "Triage":"/admin/programs/triage",
    "BAT - Looking for cofounders":"/admin/programs/bat",
  },
  "People": {
    "Program Individuals":"/admin/people/program-individuals",
    "Mentors":"/admin/people/mentors",
    "Connectors":"/admin/people/connectors",
    "Service Providers":"/admin/people/service-providers",
    "Ambassadors":"/admin/people/ambassadors",
    "Investment Committee":"/admin/people/investment-committee",
    "Contact Us":"/admin/people/contact-us",
    "Staff":"/admin/people/staff",
  },
  "Evangelism": {
    "Event Logs":"/admin/evangelism/event-logs",
    "Share Your Problems":"/admin/evangelism/share-your-problems",
    "User Logs":"/admin/evangelism/user-logs",
    "Magic Links":"/admin/evangelism/magic-links",
  },"Metrics": {
    "Program Application Stats":"/admin/evangelism/program-application-stats",
    "Cohort Management Stats":"/admin/evangelism/cohort-management-stats"
  },"Resources": {
    "Documents":"/admin/resources/documents",
    "Pitches and Meetings":"/admin/resources/pitches-and-meetings",
  },"Configurations": {
    "Authority Setting":"/admin/configurations/authority-setting",
    "Manage Cohorts":"/admin/configurations/manage-cohorts",
    
  },
}]

export default function SideNav() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number> | 'all'>();
  const [highlightPath, setHighlightPath] = useState<string>("");

  useEffect(() => {
    let found = false;
    Object.entries(menuData[0]).forEach(([category, links], index) => {
      Object.values(links).forEach((path) => {
        if (pathname.startsWith(path) && !found) {
          setSelectedKeys(new Set([index.toString()]));
          setHighlightPath(pathname);
          found = true;
        }
      });
    });
  }, [pathname]);

  const toggleSidebar = () => {
    // Ensure that on larger screens the sidebar doesn't toggle
    if (window.innerWidth < 768) {
      setIsOpen(!isOpen);
    }
    console.log('window size:', window.innerWidth)
  };

  
  return (
  <div className={`md:px-2 bg-white w-full flex-none md:w-64`}>
    <aside id="sidebar-multi-level-sidebar" className={`bg-white fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} aria-label="Sidebar">
      <button
          id="sticky-button"
          onClick={toggleSidebar}
          className={`md:hidden absolute top-0 right-[-2.5rem] w-10 h-10 bg-blue-500 flex items-center justify-center text-white z-50 transition-transform duration-300 ${
              isOpen ? 'right-[-1rem]' : 'right-[-3rem]'
          }`}
        >
            { !isOpen?(
              <Bars2Icon className="w-6 h-6" />
            ):(
              <XMarkIcon className="w-6 h-6" />
            )}
            
      </button>
      <div className="h-full px-3 py-4 overflow-y-auto dark:bg-blue-600">
        <Link href="/" className="flex flex-col ps-2.5">
          <Image src="/webpeditor_hatchery_rect.webp"
                  className="md:block mb-2"
                  alt="Hatchery Logo" />
          <span className="w-full flex flex-row items-center justify-center text-white bg-blue-600 p-2 text-xs font-semibold whitespace-nowrap dark:text-white rounded-md">
            Administrator
          </span>
        </Link>
        <Accordion showDivider={false} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} selectionMode="multiple" isCompact>
          {Object.entries(menuData[0]).map(([category, links], index) => {
            const IconComponent = iconMapping[category]; // Get the corresponding icon component for the category
            return (
              <AccordionItem id="nav-text" className="text-sm" key={index} aria-label={category} title={category} startContent={
                <IconComponent className="w-6 text-gray-900"/>
              }>
                <ul>
                  {Object.entries(links).map(([name, path]) => (
                    <li key={path}>
                      <Link href={path} className={`text-xs flex w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${highlightPath.startsWith(path) ? "bg-gray-100" : ""}`}>
                      <span className="text-gray-400 px-2" id="nav-text-link">&#x2022;</span> {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            );
          })}
        </Accordion>
          <Link href="/signout" className="text-sm w-full h-8 flex flex-row items-center justify-center text-gray-900 transition duration-75 rounded-lg group dark:text-white dark:hover:bg-gray-700 hover:bg-red-100">
            <PowerIcon className="w-6 text-red-600"/>
          </Link>
      </div>
    </aside>
  </div>
  );
}