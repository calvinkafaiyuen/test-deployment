"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '@/auth';
import { Button, Spacer, Link, User } from '@nextui-org/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { BriefcaseIcon, UserIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

import { getCofounders } from "@/app/lib/actions/account/cofounders.action";

interface TeamMember {
  firstname: string;
  lastname: string;
  status: string;
  phone: string;
  linkedin_url: string;
  personal_email: string;
  uoft_email: string;
  university: string;
  program: string;
  interests: string;
  profile_pic_url: string;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>([]);
  const team_id = Number(params.team_id);

  useEffect(() => {
    getCofounders(team_id).then(setTeamMembers);
  }, [team_id]);

  const getStatusBackgroundColor = (status: string) => {
    switch(status) {
      case "ACCEPTED":
        return "#90EE90"

      case "Interviewing":
        return "#F4A460"

      case "Declined":
        return "red"

      case "Conditional":
        return "#ADD8E6"

      case "Launched":
        return "#FFFF30"
    }
    return "lightgrey"
  }

  return (
    <>
      <div className="w-full h-full md:w-[60vw] xl:w-full">
        <div className="text-2xl"> Cofounders </div>
        <Spacer y={5} />
        <div className="flex justify-between items-center">
          <p className="text-sm"> Members in your startup company </p>
          <Button variant="light" className="text-sm md:text-base" isDisabled={false} onClick={() => window.open('/about-us/contact', '_blank')}> 
            Add / Remove Member 
          </Button>
          {/* Button for mobile display 
          <Button variant="light" className="ml-8 text-base sm:hidden" isDisabled={false} onClick={() => window.open('/contact-us', '_blank')}> 
            <PlusIcon className="h-5 w-5" /> / <MinusIcon className="h-5 w-5" /> Member 
          </Button> */}
        </div>
        <Spacer y={5} />
        <Table isHeaderSticky radius="none" shadow="none" className="border-1" fullWidth aria-label="Cofounders Table" layout='auto'>
          <TableHeader className="mb-3">
            <TableColumn key="name" minWidth={0}> Name </TableColumn>
            <TableColumn key="status" minWidth={0}> Status </TableColumn>
            <TableColumn key="email" minWidth={0}> Email </TableColumn>
            <TableColumn key="educations" minWidth={0}> Educations </TableColumn>
            <TableColumn key="expertise" minWidth={0}> Expertise </TableColumn>
            <TableColumn key="interests" minWidth={0}> Interests </TableColumn>
          </TableHeader>

          <TableBody>
            { teamMembers ?
              teamMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell> 
                    <User name={member.firstname + ' ' + member.lastname} description={member.phone}
                          avatarProps={{radius: "full", src: member.profile_pic_url, 
                      style: { 
                        width: '40px',
                        height: '40px',
                        minWidth: '40px', 
                        minHeight: '40px' 
                      }}}
                    /> 
                  </TableCell>  
                  <TableCell> 
                    <span className="rounded-full p-2" style={{backgroundColor: getStatusBackgroundColor(member.status)}}> 
                      {member.status} 
                    </span> 
                  </TableCell>  
                  <TableCell> 
                    <div className="flex"> <BriefcaseIcon className="h-5 w-5 mr-2" /> {member.uoft_email} </div>
                    <Spacer y={1} />
                    <div className="flex"> <UserIcon className="h-5 w-5 mr-2" /> {member.personal_email} </div>
                  </TableCell>  
                  <TableCell> {member.university} </TableCell> 
                  <TableCell> {member.program} </TableCell> 
                  <TableCell> {member.interests} </TableCell> 
                </TableRow>
              ))
              :
              <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
            }
          </TableBody>
        </Table>
      </div>
    </>
  );
};