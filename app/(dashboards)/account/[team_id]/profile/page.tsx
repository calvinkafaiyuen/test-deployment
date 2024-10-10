"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Spacer, Avatar, Image, Textarea, Tabs, Tab, Tooltip, Input } from '@nextui-org/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

import { canEditProfile, getStartupProfile, patchStartupProfile } from "@/app/lib/actions/account/profile.action";

interface Profile {
  team_id: number; 
  team_image: string;
  team_name: string;
  original_name: string;
  problem_statement_text: string;
  startup_technology: string;
  acceptance_letter: string;
  ownership_statement: string;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [acceptanceLetter, setAcceptanceLetter] = useState(null);
  const [ownershipStatement, setOwnershipStatement] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [startupName, setStartupName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [startupTechnology, setStartupTechnology] = useState("");
  const [display, setDisplay] = useState<string | number>("acceptance_letter");
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const team_id = Number(params.team_id)

  useEffect(() => {
    getProfile(team_id);
    canEditProfile().then(setCanEdit);
  }, [team_id]);

  const getProfile = (team_id: number) => {
    getStartupProfile(team_id)
      .then((data: any) => {
        setProfile(data);
        setStartupName(data.team_name);
        setProblemStatement(data.problem_statement_text);
        setStartupTechnology(data.startup_technology);

        if (!data.acceptance_letter && data.ownership_statement) setDisplay("ownership_statement");
      })
  }

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('startupName', startupName);
    formData.append('problemStatement', problemStatement);
    formData.append('startupTechnology', startupTechnology);
    if (uploadedImage) formData.append('uploadedImage', uploadedImage);
    if (acceptanceLetter) formData.append('acceptanceLetter', acceptanceLetter);
    if (ownershipStatement) formData.append('ownershipStatement', ownershipStatement);

    try {
      await patchStartupProfile(team_id, formData).then(() => getProfile(team_id))
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.split('/')[0] === "image") {
        setUploadedImage(file);
        const url = URL.createObjectURL(file);
        setUploadedImageUrl(url);
      } else {
        event.target.id === "acceptance_letter" ? setAcceptanceLetter(file) : setOwnershipStatement(file);
      }
    }
  }

  const handleClose = () => {
    resetImageUplaods();
    onOpenChange(); 
  };

  const resetImageUplaods = () => {
    setUploadedImage(null);
    setUploadedImageUrl(null);
  }

  const isFormChanged = () => {
    return (
      startupName !== profile?.team_name ||
      problemStatement && problemStatement !== profile?.problem_statement_text ||
      startupTechnology !== profile?.startup_technology ||
      ownershipStatement ||
      acceptanceLetter ||
      uploadedImageUrl
    );
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center">
          <span className="text-2xl">Startup Profile</span>
          <Button isIconOnly onPress={onOpen} className="bg-0 ml-3" isDisabled={!canEdit} style={{ display: canEdit ? 'inline-block' : 'none' }}>
            <PencilSquareIcon className="h-7 w-7" />
          </Button>
        </div>
        
        <Spacer y={10} />

        <div className="flex">
          <Avatar className="w-32 h-32" src={ profile?.team_image ? profile?.team_image : "/placeholder-team.png" } />

          <div className="ml-10 mt-8">
            <div> Team ID: { team_id } </div>
            <div> Current Startup Name: { profile?.team_name } </div>
            <div> Original Startup Name: { profile?.original_name } </div>
          </div>
        </div>

        <Spacer y={10} />
        <Textarea className="max-w-[800px]" label="Problem Statement" labelPlacement="outside" value={ profile?.problem_statement_text } placeholder="Problem Statement..." />
        <Spacer y={10} />
        <Textarea className="max-w-[800px]" label="Startup Technology" labelPlacement="outside" value={ profile?.startup_technology } placeholder="5G, AI, Blockchain, Quantum Computing, Robotics, Biotechnology..." />

        <Spacer y={10} />
        <div className="text-xl"> Documents </div>
        <Spacer y={3} />
        <Tabs variant="underlined" selectedKey={display} onSelectionChange={setDisplay}>
          <Tab key="acceptance_letter" title="Acceptance Letter" isDisabled={!profile?.acceptance_letter} className="pl-0"></Tab>
          <Tab key="ownership_statement" title="Assessment of Ownership" isDisabled={!profile?.ownership_statement}></Tab>
        </Tabs>
        <Spacer y={3} />
        <iframe className="w-full min-h-[800px]" src={display === "acceptance_letter" ? profile?.acceptance_letter : profile?.ownership_statement} title="Document Viewer"> </iframe>
      </div>

      <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl" className="text-sm" >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Edit startup profile </ModalHeader>
              <ModalBody>
                <div className="flex items-center">
                  <Avatar className="w-20 h-20" src={uploadedImageUrl ? uploadedImageUrl : (profile?.team_image ? profile?.team_image : "/placeholder-team.png")} />
                  <div className="ml-10">
                    <div> Startup Logo </div>
                    <Spacer y={1} />
                    <input type="file" className="w-[250px]" accept="image/" onChange={ handleFileUpload } />
                  </div>
                </div>
                <Spacer y={3} />
                <Input label="Current Startup Name" labelPlacement="outside" defaultValue={ profile?.team_name } isRequired onChange={(e) => setStartupName(e.target.value)} ></Input>
                <Spacer y={3} />
                <Textarea className="max-w-[800px]" label="Problem Statement" labelPlacement="outside" defaultValue={ profile?.problem_statement_text } placeholder="Problem Statement..."  onChange={(e) => setProblemStatement(e.target.value)} isRequired />
                <Spacer y={3} />
                <Textarea className="max-w-[800px]" label="Startup Technology" labelPlacement="outside" defaultValue={ profile?.startup_technology } placeholder="5G, AI, Blockchain, Quantum Computing, Robotics, Biotechnology..." onChange={(e) => setStartupTechnology(e.target.value)} />
                <Spacer y={3} />
                <div className="flex justify-between">
                  <div>
                    Acceptance Letter 
                    <Spacer y={1} />
                    <input type="file" className="w-[250px]" accept=".pdf" id="acceptance_letter" onChange={ handleFileUpload } />
                  </div>
                  <div>
                    Ownership Statement 
                    <Spacer y={1} />
                    <input type="file" className="w-[250px]" accept=".pdf" id="ownership_statement" onChange={ handleFileUpload } />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose} onClick={resetImageUplaods}>
                  Close
                </Button>
                <Button color="primary" onPress={handleClose} onClick={handleSave} isDisabled={!(startupName && problemStatement && isFormChanged())} >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};