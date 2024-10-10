"use client";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Link, Accordion, AccordionItem } from "@nextui-org/react";
import { Bars2Icon, XMarkIcon, PowerIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function SideNav({ team_id, isAdmin }: any) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number> | 'all'>();
  const [highlightPath, setHighlightPath] = useState<string>("");

  const iconMapping: { [key: string]: any } = {
    "Build A Team": UserGroupIcon,
    "Startup": ChartBarIcon,
  };

  const menuData = [{
    "Build A Team": {
      "Looking for a team": `/account/${team_id}/build-a-team/looking-for-a-team`,
      "Looking for cofounders": `/account/${team_id}/build-a-team/looking-for-cofounders`,
    },
    "Startup": isAdmin ? {
      "Profile": `/account/${team_id}/profile`,
      "Advisory Board": `/account/${team_id}/advisory-board`,
      "Deliverables": `/account/${team_id}/deliverables`,
      "Pitches and Meetings": `/account/${team_id}/pitches-and-meetings`,
      "Resources": `/account/${team_id}/resources`,
      "Cofounders": `/account/${team_id}/cofounders`,
      "Admin Notes": `/account/${team_id}/admin-notes`,
    } : {
      "Profile": `/account/${team_id}/profile`,
      "Advisory Board": `/account/${team_id}/advisory-board`,
      "Deliverables": `/account/${team_id}/deliverables`,
      "Pitches and Meetings": `/account/${team_id}/pitches-and-meetings`,
      "Resources": `/account/${team_id}/resources`,
      "Cofounders": `/account/${team_id}/cofounders`,
    } 
  }];

  useEffect(() => {
    Object.entries(menuData[0]).forEach(([, links], index) => {
      Object.values(links).forEach((path) => {
        if (pathname.startsWith(path)) {
          setSelectedKeys(new Set([index.toString()]));
          setHighlightPath(pathname);
        }
      });
    });
  }, [pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`md:px-2 bg-white w-full flex-none md:w-64`}>
      <aside className={`bg-white fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} aria-label="Sidebar">
        <button
          onClick={toggleSidebar}
          className={`md:hidden absolute top-0 right-[-2.5rem] w-10 h-10 bg-blue-500 flex items-center justify-center text-white z-50 transition-transform duration-300 ${isOpen ? 'right-[-1rem]' : 'right-[-3rem]'}`}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars2Icon className="w-6 h-6" />}
        </button>
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-blue-600">
          <Link href="/" className="flex flex-col ps-2.5">
            <span className="w-full flex flex-row items-center justify-center text-white bg-blue-600 p-2 text-xs font-semibold whitespace-nowrap dark:text-white rounded-md">
              The Entrepreneurship Hatchery
            </span>
          </Link>
          <Accordion showDivider={false} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} selectionMode="multiple" isCompact>
            {Object.entries(menuData[0]).map(([category, links], index) => {
              const IconComponent = iconMapping[category];
              return (
                <AccordionItem key={index} aria-label={category} title={category} startContent={<IconComponent className="w-6 text-gray-900" />}>
                  <ul>
                    {Object.entries(links).map(([name, path]) => (
                      <li key={path}>
                        <Link href={path} className={`text-xs flex w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${highlightPath.startsWith(path) ? "bg-gray-100" : ""}`}>
                          <span className="text-gray-400 px-2">&#x2022;</span> {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              );
            })}
          </Accordion>
          <Link href="/signout" className="text-sm w-full h-8 flex flex-row items-center justify-center text-gray-900 transition duration-75 rounded-lg group dark:text-white dark:hover:bg-gray-700 hover:bg-red-100">
            <PowerIcon className="w-6 text-red-600" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
