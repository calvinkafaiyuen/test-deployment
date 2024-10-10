import React from "react";
import HatcheryNavigation from "@/app/ui/navigation";
import { Input, Button, Textarea } from "@nextui-org/react";
import { applyToMentor } from "@/app/lib/engage/investment/action";

const Section1 = () => {
  return (
    <div className="p-8 lg:py-14 lg:px-20 flex flex-col items-center">
      <p className="text-3xl text-[#0072F5]">
        Investment Committee Member - Application Form
      </p>
      <form
        action={applyToMentor}
        className="w-full rounded shadow-md my-10 p-8 flex flex-col md:flex-row flex-wrap justify-between"
      >
        <div className="md:w-[47.5%] mb-8">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="input-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:w-[47.5%] mb-8">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="input-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:w-[30%] mb-8">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:w-[30%] mb-8">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            required
            pattern="^\+?[0-9]+$"
            className="input-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:w-[30%] mb-8">
          <label htmlFor="linkedin" className="form-label">
            Linkedin URL
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            required
            className="input-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="w-full mb-8">
          <label htmlFor="bio" className="form-label">
            Tell us about yourself
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            placeholder="I am..."
            className="textarea-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-8 ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>

      {/* <form className="w-full rounded shadow-md my-10 p-8 flex flex-col md:flex-row flex-wrap justify-between" action={applyToMentor}>
        <Input label="First Name" size="sm" className="md:w-[47.5%] mb-8" isRequired name="firstName"  />
        <Input label="Last Name" size="sm" className="md:w-[47.5%] mb-8" isRequired name="lastName"  />
        <Input label="Email" size="sm" className="md:w-[30%] mb-8" isRequired name="email" />
        <Input label="Phone" size="sm" className="md:w-[30%] mb-8" isRequired name="phone"  />
        <Input label="Linkedin URL" size="sm" className="md:w-[30%] mb-8" isRequired name="linkedin"  />
        <Textarea label="Tell us about yourself" placeholder="I am..." isRequired name="bio"  />
        <Button color="primary" className="mt-8 ml-auto" >Submit</Button>
      </form> */}
    </div>
  );
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <HatcheryNavigation />
      <Section1 />
    </main>
  );
}
