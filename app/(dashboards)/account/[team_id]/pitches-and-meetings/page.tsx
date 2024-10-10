"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';  // Import dynamic from next/dynamic
import { Button, Spacer, Image, Input, Tabs, Tab, Tooltip, Divider, Accordion, AccordionItem } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// Dynamically import ReactQuill and disable SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import './quill.css';

import { canEditPitchesMeetings, getPitchesMeetings, getPitchHistory, patchPitchMeeting, postNewMeeting } from "@/app/lib/actions/account/pitches-meetings.action";

interface PitchMeeting {
  pitch_reference: number;
  pitch_name: string;
  date_submitted: Date;
  presentation_date: Date;
  pitching_comment: string;
  video_url: string;
}

interface PitchHistory {
  pitching_comment: string;
  updated_at: Date;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pitchesMeetings, setPitchesMeetings] = useState<PitchMeeting[]>([]);
  const [selectedPitchMeeting, setSelectedPitchMeeting] = useState<PitchMeeting | null>(null);
  const [pitchHistory, setPitchHistory] = useState<PitchHistory[]>([]);
  const [pitchingComment, setPitchingComment] = useState('');
  const [action, setAction] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dateTimeRef = useRef<HTMLInputElement>(null);
  const meetingNameRef = useRef<HTMLInputElement>(null);
  const [dateTime, setDateTime] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const team_id = Number(params.team_id)

  useEffect(() => {
    canEditPitchesMeetings().then(setCanEdit);
    getPitchesMeetings(team_id)
      .then((data: PitchMeeting[]) => {
        setPitchesMeetings(data);
        if (data.length) {
          setSelectedPitchMeeting(data[0]);
          getPitchHistory(data[0].pitch_reference).then(setPitchHistory);
          setPitchingComment(data[0]?.pitching_comment);
        }
      })
  }, [team_id]);

  const selectPitchMeeting = (index: number) => {
    setSelectedPitchMeeting(pitchesMeetings[index]);
    setPitchingComment(pitchesMeetings[index]?.pitching_comment ? pitchesMeetings[index]?.pitching_comment : '');
    getPitchHistory(pitchesMeetings[index]?.pitch_reference).then(setPitchHistory);
    setDisableSave(true);
  }

  const handleChange = (e: any) => {
    // this condition handles the case where user selects a meeting with no pitch notes which generates the value "<p><br></p>" and messes up the input value
    if (e != "<p><br></p>") {
      setPitchingComment(e);
      setDisableSave(false);
    }
  }

  const handleSave = () => {
    if (selectedPitchMeeting) {
      setIsLoading(true);
      patchPitchMeeting(selectedPitchMeeting?.pitch_reference, selectedPitchMeeting?.pitching_comment, pitchingComment)
        .then(() => {
          getPitchesMeetings(team_id)
            .then((data: PitchMeeting[]) => {
              setPitchesMeetings(data);
              data.forEach((pm: PitchMeeting) => {
                if (pm.pitch_reference === selectedPitchMeeting?.pitch_reference) {
                  setSelectedPitchMeeting(pm);
                  getPitchHistory(pm.pitch_reference).then(setPitchHistory);
                }
              })
              setIsLoading(false);
            })
        })
    };
  }

  const createMeeting = () => {
    postNewMeeting(team_id, meetingName, dateTime)
      .then(() => {
        getPitchesMeetings(team_id).then(setPitchesMeetings);
        // Refresh the page after creating a new meeting
        getPitchesMeetings(team_id)
        .then((data: PitchMeeting[]) => {
          setPitchesMeetings(data);
          if (data.length) {
            setSelectedPitchMeeting(data[0]);
            getPitchHistory(data[0].pitch_reference).then(setPitchHistory);
            setPitchingComment(data[0]?.pitching_comment);
          }
        })
      })
  }

  const hasChanges = () => {
    return pitchingComment != selectedPitchMeeting?.pitching_comment;
  }

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="text-2xl">Pitches and Meetings</div>
        <Spacer y={10} />
        <div className="flex justify-between w-full max-w-[1130px]">
          <div className="flex items-center">
            {pitchesMeetings.length > 0 &&
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    <span className="font-bold">
                      {selectedPitchMeeting?.presentation_date.toLocaleDateString()} </span> - {selectedPitchMeeting?.pitch_name}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  {pitchesMeetings.map((item, index) => (
                    <DropdownItem key={index} onClick={() => selectPitchMeeting(index)} textValue={item.pitch_name}>
                      <span className="font-bold"> {item.presentation_date.toLocaleDateString()} </span> - {item.pitch_name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            }
            <Button variant="light" className="ml-8 text-base" onPress={onOpen} onClick={() => setAction('create_meeting')} isDisabled={!canEdit}>
              <PlusIcon className="h-5 w-5" /> Meeting
            </Button>
          </div>
          {pitchHistory.length > 0 && <Button className="text-base" variant="light" onPress={onOpen} onClick={() => setAction('view_history')}> View History </Button>}
        </div>
        <Spacer y={5} />

        <div className="flex flex-col items-center w-full max-w-[1130px]">
          <div className="w-full relative">
            <ReactQuill className="w-full" value={pitchingComment} onChange={handleChange} placeholder="Compose an epic..." readOnly={!canEdit} />
            <div className="relative">
              <Button onClick={handleSave} color="primary" className="absolute bottom-0 right-0 m-4 text-md" isDisabled={!hasChanges() || disableSave} isLoading={isLoading} style={{ display: canEdit ? 'inline-block' : 'none' }}>
                Save
              </Button>
            </div>
          </div>

          <Spacer y={8} />

          {!selectedPitchMeeting?.video_url ?
            <div className="w-full text-center font-bold text-lg">
              <Divider></Divider>
              <Spacer y={3} />
              Video not available
            </div>
            :
            <iframe className="w-full h-[50vh] block bg-black"
              allowFullScreen
              src={"https://player.vimeo.com/video/" + selectedPitchMeeting?.video_url + "?h=45d91d9075&badge=0&autopause=0&player_id=0&app_id=58479"}>
            </iframe>
          }
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="text-sm" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> {action === 'create_meeting' ? 'Create new meeting' : 'History of your startup pitches and meetings'} </ModalHeader>
              <ModalBody>
                {action === 'create_meeting' ?
                  <div className="flex flex-col max-w-[500px]">
                    <div> Date and time </div>
                    <Spacer y={2} />
                    <input type="datetime-local" min={getCurrentDateTime()} className="p-2 border-2 border-slate-300 rounded-small" onChange={(e) => { setDateTime(e.target.value) }} ref={dateTimeRef} />

                    <Spacer y={10} />
                    <Input label="Meeting name" labelPlacement="outside" placeholder="Pitch Review" isRequired onChange={(e) => { setMeetingName(e.target.value) }} ref={meetingNameRef}></Input>
                    <Spacer y={5} />
                  </div>
                  :
                  <Accordion>
                    {pitchHistory.map((history, index) => (
                      <AccordionItem key={index}
                        title={'Version #' + (pitchHistory.length - index)}
                        subtitle={'Updated at ' + history.updated_at.toLocaleDateString() + ' at ' + history.updated_at.toLocaleTimeString()}>
                        <div dangerouslySetInnerHTML={{ __html: history.pitching_comment }} />
                      </AccordionItem>
                    ))}
                  </Accordion>
                }
              </ModalBody>
              <ModalFooter>
                {action === 'create_meeting' &&
                  <>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose} onClick={createMeeting} isDisabled={!dateTimeRef.current?.value || !meetingNameRef.current?.value}>
                      Submit
                    </Button>
                  </>
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
