"use client"

import React, { useState } from "react";
import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import HatcheryNavigation from '@/app/ui/navigation';
import { applyToMentor } from "@/app/lib/engage/mentorship/action";
import { useFormState } from "react-dom";

const Section1 = () => {
  const [errorMessage, action] = useFormState(applyToMentor, undefined);
  const [initial, setInitial] = useState("Mr.");
  const [resume, setResume] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setResume(file.name);
  };

  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-3xl text-[#0072F5]"> Apply to be a Hatchery Mentor </p>

      <form className="my-8 w-full flex flex-col items-center" action={action}> 
        <div className="flex flex-col md:flex-row flex-wrap justify-center">
          {/* <div className="md:w-[23%] m-2 mt-0">
            <text className="text-sm absolute"> Initial </text>
            <Dropdown className="mt-6">
              <DropdownTrigger className="w-full">
                <Button variant="bordered" className="h-[40px] mt-6 w-full">
                  {initial}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={(selectedValue : any) => setInitial(selectedValue.currentKey)}
              >
                <DropdownItem key="Mr."> Mr. </DropdownItem>
                <DropdownItem key="Mrs."> Mrs. </DropdownItem>  
                <DropdownItem key="Ms."> Ms. </DropdownItem>
                <DropdownItem key="Dr."> Dr. </DropdownItem>
                <DropdownItem key="Prof."> Prof. </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> */}

          <div className="md:w-[23%] m-2 mt-0">
            <text className="text-sm absolute"> Initial </text>
            <select className="appearance-none block mt-6 w-full border-2 border-grey-300 border-radius rounded-lg h-[40px] cursor-pointer text-center" name="Initial">
              <option value="Mr."> Mr. </option>
              <option value="Mrs."> Mrs. </option>
              <option value="Ms."> Ms. </option>
              <option value="Dr."> Dr. </option>
              <option value="Prof."> Prof. </option>
            </select>
          </div>

          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="First Name" name="First Name" /> 
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Middle Name" name="Middle Name" />
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Last Name" name="Last Name" />
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Email" name="Email" />
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Phone" name="Phone" />
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Linkedin" name="Linkedin" />
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Twitter" name="Twitter" />
          <div className="md:w-[23%] m-2 mt-0">
            <text className="text-sm absolute"> Upload Resume </text>
            <div className="bg-zinc-100 p-1 pl-2 h-[40px] rounded-lg mt-6">
              <input className="w-full" type="file" onChange={handleFileChange} name="Resume" />
            </div>
          </div>
          <Input size="md" className="md:w-[23%] m-2" placeholder=" " labelPlacement="outside" label="Industry" name="Industry" />
        </div>

        <Button color="primary" type="submit" className="my-5"> SUBMIT </Button>
        {errorMessage && (
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage.message}</p>
          </div>
        )}
      </form>
      <p> *You agree to the terms and conditions by submitting this form. </p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section1 />
    </main>
  );
}