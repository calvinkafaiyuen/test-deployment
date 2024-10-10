"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '@/auth';
import { Button, Spacer, Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { DocumentIcon } from '@heroicons/react/24/outline';

import { getResources } from "@/app/lib/actions/account/resources.action";

interface Resource {
  id: number;
  resource_name: string;
  doc_path: string;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [resources, setResources] = useState<Resource[] | null>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const team_id = Number(params.team_id)

  useEffect(() => {
    getResources().then(res => {
      console.log(res)
      if (res) setResources(res);
    })
  }, []);

  const getIconColor = (path: string) => {
    const path_array = path.split('.')
    switch (path_array[path_array.length - 1])  {
      case ('pdf'):
        return 'red'
      case ('xlsx'):
        return 'green'
      case ('docx'):
        return 'blue'
    }
  }

  const handleOpen = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="text-2xl"> Resources </div>
        <Spacer y={5} />
        <p className="text-sm"> Below are the resources available for your current Hatchery program </p>
        <Spacer y={3} />
        <Listbox className="border-small p-5 text-lg" aria-label="Resources Table">
          <ListboxSection title="Resources"> 
            {/* <ListboxItem key={index} startContent={index} > {item.resource_name} </ListboxItem> */}
            {resources ? resources.map((item, index) => (
              <ListboxItem key={index} 
                           startContent={ <DocumentIcon className="h-5 w-5 mr-1" style={{color: getIconColor(item.doc_path) }} /> } 
                           className="border-t-small rounded-none py-3" 
                           textValue={item.resource_name}
                           onClick={() => handleOpen(item)}> {item.resource_name} </ListboxItem>
            )) : []}
          </ListboxSection> 
        </Listbox>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" className="text-sm" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> {selectedResource?.resource_name} </ModalHeader>
              <ModalBody>
              <iframe className="w-full h-full" src={selectedResource?.doc_path} title="Document Viewer"> </iframe>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="primary" onPress={onClose} onClick={handleAddAdvisors}> Save </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};