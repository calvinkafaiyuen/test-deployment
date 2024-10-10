"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '@/auth';
import { Button, Spacer, Input, Accordion, AccordionItem } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { getAdminNotes, createAdminNote, editAdminNote, deleteAdminNote } from "@/app/lib/actions/account/admin-notes.action";

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import '../pitches-and-meetings/quill.css';

interface Note {
  note_id: number;
  notes: string;
  title: string;
  creator: string;
  created_on: Date;
  last_editor: string;
  last_edit_on: Date;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [notes, setNotes] = useState<Note[] | null>([]);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [action, setAction] = useState("");
  const team_id = Number(params.team_id)

  useEffect(() => {
    getNotes(team_id)
  }, [team_id]);

  const getNotes = (team_id: number) => {
    getAdminNotes(team_id).then(setNotes);
  }

  const handleSave = () => {
    if (selectedNote) editAdminNote(selectedNote, title, value).then(() => getNotes(team_id));
  }

  const handleDelete = (note_id: number) => {
    deleteAdminNote(note_id).then(() => getNotes(team_id));
  }

  const createNote = async () => {
    createAdminNote(team_id, title, value).then(() => getNotes(team_id));
  }

  const handleCreate = () => {
    setAction("create"); 
    setValue(""); 
    setTitle("");
    onOpenChange();
  }

  const handleEdit = (note: Note) => {
    setAction("edit"); 
    setValue(note.notes); 
    setTitle(note.title); 
    setSelectedNote(note.note_id);
    onOpenChange();
  }

  const isEdited = (note: Note) => {
    return note.created_on.toLocaleDateString() !== note.last_edit_on.toLocaleDateString() ||
           note.created_on.toLocaleTimeString() !== note.last_edit_on.toLocaleTimeString()
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="text-2xl"> Administrator Notes </div>
        <Spacer y={5} />
        <div className="flex justify-between items-center">
          <p className="text-sm"> Below are the notes you have created for this startup </p>
          <Button variant="light" className="ml-8 text-base" onPress={handleCreate}> 
            <PlusIcon className="h-5 w-5" /> Note
          </Button>
        </div>
        <Spacer y={5} />

        { notes && 
          <Accordion>
            {notes.map((note, index) => (
              <AccordionItem key={index} 
                             title={note.title? note.title : "Note"} 
                             subtitle={ <div className="flex justify-between"> 
                                          { !isEdited(note) ? 
                                            <span> {'Created by ' + note.creator + ' on ' + note.created_on.toLocaleDateString() + ' ' + note.created_on.toLocaleTimeString()} </span>
                                            :
                                            <span> {'Last edited by ' + note.last_editor + ' on ' + note.last_edit_on.toLocaleDateString() + ' ' + note.last_edit_on.toLocaleTimeString()} </span>
                                          }
                                        </div> 
                                      }> 
                <div dangerouslySetInnerHTML={{ __html: note.notes }} />
                <div className="flex justify-end">
                  <Button variant="light" color="primary" onPress={() => {handleEdit(note)}}> edit </Button>
                  <Button variant="light" color="danger" onClick={() => handleDelete(note.note_id)} className="mr-2"> delete </Button>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        }
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="text-sm" >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> {action === "create" ? "Create new note" : "Edit note"} </ModalHeader>
              <ModalBody>
                <Input className="w-80" label="Title" labelPlacement="outside" placeholder="Add a title..." defaultValue={title} onChange={(e) => setTitle(e.currentTarget.value)}></Input>
                <Spacer y={2} />
                <ReactQuill className="w-full" value={value} onChange={setValue} placeholder="Compose an epic..." />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} onClick={action === "create" ? createNote : handleSave} isDisabled={value === "" || value === "<p><br></p>"}> Save </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};