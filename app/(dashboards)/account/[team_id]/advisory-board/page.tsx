"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '@/auth';
import { Button, Spacer, Card, CardHeader, CardBody, CardFooter, Divider, Listbox, ListboxItem, Avatar } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { PlusIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

import { canEditAdvisoryBoard, getAdvisoryBoardMembers, getAllAdvisors, addAdvisors, removeAdvisor } from "@/app/lib/actions/account/advisory-board.action";

interface Member {
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id: number;
  profile_image: string;
}

interface Advisor {
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  id: number;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [members, setMembers] = useState<Member[] | null>([]);
  const [advisors, setAdvisors] = useState<Advisor[] | null>([]); 
  const [selectedMentors, setSelectedMentors] = useState(new Set());
  const [selectedConnectors, setSelectedConnectors] = useState(new Set());
  const [selectedStaff, setSelectedStaff] = useState(new Set());
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const team_id = Number(params.team_id)

  const updateAdvisoryBoardMembers = () => {
    getAdvisoryBoardMembers(team_id).then((res_members) => {
      setMembers(res_members);
      getAllAdvisors().then((res_advisors) => {
        if (!Array.isArray(res_advisors)) {
          return;
        }
        const advisory_member_emails = res_members.map(item => item.email);
        setAdvisors(res_advisors.filter(item => !advisory_member_emails.includes(item.email)));
      });
    });
  };

  useEffect(() => {
    updateAdvisoryBoardMembers();
    canEditAdvisoryBoard().then(setCanEdit);
  }, [team_id]);

  const handleAddAdvisors = () => {
    addAdvisors(team_id, selectedMentors, selectedConnectors, selectedStaff).then(updateAdvisoryBoardMembers)
  }

  const handleRemove = (id: number|string, role: string) => {
    removeAdvisor(team_id, id, role).then(updateAdvisoryBoardMembers)
  }

  const handleMentorSelectionChange = (selectedItems: any) => {
    setSelectedMentors(selectedItems);
  }
  
  const handleConnectorSelectionChange = (selectedItems: any) => {
    setSelectedConnectors(selectedItems);
  }

  const handleStaffSelectionChange = (selectedItems: any) => {
    setSelectedStaff(selectedItems);
  }

  const handleOpen = () => {
    setSelectedMentors(new Set());
    setSelectedConnectors(new Set());
    setSelectedStaff(new Set());
    onOpen();
  }

  return (
    <>
      <div className="w-full h-full">
        <span className="text-2xl"> Advisory </span>
        <Spacer y={5} />
        <div className="flex justify-between items-center">
        <p className="text-sm"> Advisory board members in your startup company </p>
          <Button variant="light" className="ml-8 text-base" onPress={handleOpen} isDisabled={!canEdit}> 
            <PlusIcon className="h-5 w-5" /> Member
          </Button>
        </div>
        <Spacer y={10} />
        <div className="flex flex-wrap p-1">
          { members &&
            members.map((member, index) => (
              <Card className="mb-5 mr-5 w-[320px]" shadow="sm" key={index}>  
                <CardHeader className="bg-[#2F6FEB] text-white font-bold"> {member.role} </CardHeader>
                <Divider />
                <CardBody> 
                  <div className="flex gap-3 items-center">
                    {/* <Avatar /> */}
                    {member.first_name + ' ' + member.last_name} 
                  </div>
                  <Spacer y={3} />
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="h-5 w-5 mr-3" /> 
                    <div className="w-full overflow-hidden"> {member.email} </div>
                  </div>
                  <Spacer y={3} />
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="h-5 w-5 mr-3" /> {member.phone? member.phone : 'N/A'}
                  </div>
                </CardBody>
                <CardFooter className="pt-0"> 
                  <Button color="danger" variant="light" className="ml-auto" onClick={() => handleRemove(member.role === 'Hatchery Connector' ? member.id : member.email, member.role)}> Remove </Button> 
                </CardFooter>
              </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" className="text-sm" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Add advisory board member </ModalHeader>
              <ModalBody>
                { advisors && 
                  <div className="flex justify-between">
                    <div className="w-[30%]">
                      <div> Mentors </div>
                      <Listbox className="max-h-80 overflow-scroll border-small" selectionMode="multiple" aria-label="mentors" onSelectionChange={handleMentorSelectionChange}>
                        { advisors.filter(item => item.role === 'm').map((mentor, index) => (
                          <ListboxItem key={mentor.first_name + ' ' + mentor.last_name + ' ' + mentor.email.trim()} textValue={mentor.email}>
                            <div className="flex items-center gap-2">
                              {/* <Avatar alt={mentor.email} size="sm" /> */}
                              <div className="flex flex-col flex-grow-2">
                                <span className="text-small"> {mentor.first_name + ' ' + mentor.last_name} </span>
                                <span className="text-tiny text-default-400"> {mentor.email} </span>
                              </div>
                            </div>
                          </ListboxItem>
                        ))}
                      </Listbox>
                    </div>
                    
                    <div className="w-[30%]">
                      <div> Connectors </div>
                      <Listbox className="max-h-80 overflow-y-auto border-small" selectionMode="multiple" aria-label="connectors" onSelectionChange={handleConnectorSelectionChange}>
                        { advisors.filter(item => item.role === 'c').map((connector, index) => (
                          <ListboxItem textValue={connector.email} key={connector.first_name + ' ' + connector.last_name + ' ' + connector.id} description={connector.email}>
                            {connector.first_name + ' ' + connector.last_name}
                          </ListboxItem>
                        ))}
                      </Listbox>
                    </div>
                    
                    <div className="w-[30%]">
                      <div> Staff </div>
                      <Listbox className="max-h-80 overflow-y-auto border-small" selectionMode="multiple" aria-label="staff" onSelectionChange={handleStaffSelectionChange}>
                        { advisors.filter(item => item.role === 's').map((staff, index) => (
                          <ListboxItem textValue={staff.email} key={staff.first_name + ' ' + staff.last_name + ' ' + staff.email.trim()} description={staff.email}> 
                            {staff.first_name + ' ' + staff.last_name} 
                          </ListboxItem>
                        ))}
                      </Listbox>
                    </div>
                  </div>
                }
                <Spacer y={5} />
                <div className="flex flex-wrap text-md">
                  <div className="mr-3 font-bold"> Mentors: </div>
                  { selectedMentors.size > 0 &&
                    Array.from(selectedMentors).map((mentor: any, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="mr-3">, </span>}
                        <div>{mentor.split(' ').slice(0, -1).join(' ')}</div>
                      </React.Fragment>
                    ))
                  }
                </div>
                <div className="flex flex-wrap">
                  <div className="mr-3 font-bold"> Connectors: </div>
                  { selectedConnectors.size > 0 &&
                    Array.from(selectedConnectors).map((connector: any, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="mr-3">, </span>}
                        <div>{connector.split(' ').slice(0, -1).join(' ')}</div>
                      </React.Fragment>
                    ))
                  }
                </div>
                <div className="flex flex-wrap">
                  <div className="mr-3 font-bold"> Staff: </div>
                  { selectedStaff.size > 0 &&
                    Array.from(selectedStaff).map((staff: any, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="mr-3">, </span>}
                        <div>{staff.split(' ').slice(0, -1).join(' ')}</div>
                      </React.Fragment>
                    ))
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} onClick={handleAddAdvisors} isDisabled={selectedConnectors.size === 0 && selectedMentors.size === 0 && selectedStaff.size === 0}> Save </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};