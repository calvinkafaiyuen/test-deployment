"use client"

import React, { useState } from "react";
import { Spacer, Input, Button } from "@nextui-org/react";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import HatcheryNavigation from '@/app/ui/navigation';
import { applyToAbassador } from "@/app/lib/engage/ambassador/action";
import { useFormState } from "react-dom";

const Section1 = () => {
  const [errorMessage, action] = useFormState(applyToAbassador, undefined);

  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-3xl text-[#0072F5]"> Apply to be a Hatchery Ambassador </p>

      <form className="my-8 w-full flex flex-col items-center" action={action}> 
        <div className="flex flex-wrap justify-between">
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="First Name" name="First Name" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Last Name" name="Last Name" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Utorid" name="Utorid" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Email" name="Email" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Phone" name="Phone" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Linkedin" name="Linkedin" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Program" name="Program" />
          <Input size="md" className="md:w-[23%] mb-4" placeholder=" " labelPlacement="outside" label="Grad. Year" name="Grad. Year" />
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