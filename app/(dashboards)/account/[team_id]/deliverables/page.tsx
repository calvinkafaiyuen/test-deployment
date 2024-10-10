"use client";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '@/auth';
import { Button, Spacer, Tabs, Tab, Divider } from '@nextui-org/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import { getDeliverables, uploadDeliverables } from "@/app/lib/actions/account/deliverables.action";

interface Deliverables {
  id: number;
  business_plan: string; 
  business_plan_date: Date;
  cash_flow: string;
  cash_flow_date: Date;
  one_pager: string;
  one_pager_date: Date;
  pitch_deck: string;
  pitch_deck_date: Date;
  hatchery_mining: string;
  hatchery_mining_date: Date;
}

export default function Page({ params }: { params: { program: string, team_id: string } }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [deliverables, setDeliverables] = useState<Deliverables | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);
  const [onePager, setOnePager] = useState(null);
  const [pitchDeck, setPitchDeck] = useState(null);
  const [hatcheryMining, setHatcheryMining] = useState(null);
  const team_id = Number(params.team_id);

  useEffect(() => {
    getDeliverables(team_id).then((res) => {
      if (!res) return;
      setDeliverables(res);
      for (let key in res) {
        if (key !== 'id' && !key.includes('_date') && res[key] !== null) {
          setSelectedDeliverable(res[key]);
          setSelectedDate(res[key + '_date'])
          break;
        }
      }
    });
  });

  const handleOnChange = (e: any) => {
    if (deliverables) {
      const key = e as keyof Deliverables;
      const key_date = e + '_date' as keyof Deliverables;
      setSelectedDeliverable(deliverables[key] as string);
      setSelectedDate(deliverables[key_date] as Date);
    }
  }

  const getSelectedKey = () => {
    for (let item in deliverables) {
      const key = item as keyof Deliverables;
      if (deliverables[key] === selectedDeliverable) return key;
    }
  }

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      switch(event.target.id) {
        case 'business_plan':
          setBusinessPlan(file);
          break;

        case 'cashflow':
          setCashFlow(file);
          break;

        case 'one_pager':
          setOnePager(file);
          break;

        case 'pitch_deck':
          setPitchDeck(file);
          break;
        case 'hatchery_mining':
          setHatcheryMining(file);
          break;
      }
    }
  }

  const hasUploadedFile = () => {
    return (businessPlan || cashFlow || onePager || pitchDeck || hatcheryMining);
  }

  const handleSave = async () => {
    const formData = new FormData();
    if (businessPlan) formData.append('businessPlan', businessPlan);
    if (cashFlow) formData.append('cashFlow', cashFlow);
    if (onePager) formData.append('onePager', onePager);
    if (pitchDeck) formData.append('pitchDeck', pitchDeck);
    if (hatcheryMining) formData.append('hatcheryMining', hatcheryMining);

    try {
      await uploadDeliverables(team_id, formData).then(() => getDeliverables(team_id)
      .then(res => {
        setDeliverables(res);
        if (!selectedDeliverable) {
          for (let key in res) {
            if (key !== 'id' && !key.includes('_date') && res[key] !== null) {
              setSelectedDeliverable(res[key]);
              setSelectedDate(res[key + '_date'])
              break;
            }
          }
        }
      }))
      console.log('Deliverables uploaded successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center">
          <span className="text-2xl"> Deliverables </span>
          <Button isIconOnly className="bg-0 ml-3" onClick={onOpen}>
            <PencilSquareIcon className="h-7 w-7" />
          </Button>
        </div>
        <Spacer y={5} />
        <p className="text-sm"> Please upload any missing deliverables for your startup below. </p>
        <Spacer y={5} />
        <Tabs variant="underlined" selectedKey={getSelectedKey()} onSelectionChange={handleOnChange}>
          <Tab key="business_plan" title="Business Plan" className="pl-0" isDisabled={!deliverables || deliverables?.business_plan === null}></Tab>
          <Tab key="cash_flow" title="Cashflow" isDisabled={!deliverables || deliverables?.cash_flow === null}></Tab>
          <Tab key="one_pager" title="One Pager" isDisabled={!deliverables || deliverables?.one_pager === null}></Tab>
          <Tab key="pitch_deck" title="Pitch Deck" isDisabled={!deliverables || deliverables?.pitch_deck === null}></Tab>
          <Tab key="hatchery_mining" title="Hatchery Mining" isDisabled={!deliverables || deliverables?.hatchery_mining === null}></Tab>
        </Tabs>
        <Spacer y={2} />
        <Divider></Divider>
        <Spacer y={2} />
        { selectedDate && <div> Last updated on {selectedDate?.toLocaleDateString()} </div> }
        <Spacer y={2} />
        <iframe className="w-full min-h-[800px]" title="Document Viewer" src={selectedDeliverable ? selectedDeliverable : ''}> </iframe>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="text-sm" >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Upload deliverables </ModalHeader>
              <ModalBody>
                <p> Please upload any missing deliverables for your startup below. (max. file size 4MB) </p>
                <div className="flex flex-col gap-1 mt-3">
                    <div> Business Plan (PDF) </div>
                    <input type="file" accept=".pdf" id="business_plan" onChange={ handleFileUpload } />
                    <Spacer y={3} />
                    <div> Cashflow (XLSX/XLS)  </div>
                    <input type="file" accept=".xlsx .xls" id="cashflow" onChange={ handleFileUpload } />
                    <Spacer y={3} />
                    <div> One Pager (PDF)  </div>
                    <input type="file" accept=".pdf" id="one_pager" onChange={ handleFileUpload } />
                    <Spacer y={3} />
                    <div> Pitch Deck (PDF)  </div>
                    <input type="file" accept=".pdf" id="pitch_deck" onChange={ handleFileUpload } />
                    <Spacer y={3} />
                    <div> Hatchery Mining (XLSX/XLS) </div>
                    <input type="file" accept=".xlsx .xls" id="hatchery_mining" onChange={ handleFileUpload } />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" isDisabled={!hasUploadedFile()} onClick={handleSave} onPress={onClose}>
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