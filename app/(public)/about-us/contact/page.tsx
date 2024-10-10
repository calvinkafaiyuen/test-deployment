"use client";
import React from "react";
import { useState } from "react";
import { Spacer, Image, Button } from "@nextui-org/react";
import HatcheryNavigation from "@/app/ui/navigation";

const Section1 = () => {
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, set_email] = useState("");
  const [phone, set_phone] = useState("");
  const [message, set_message] = useState("");

  const sendMail = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // const response = await fetch("../lib/api/email_handler", {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        phone,
        message,
      }),
    });
    console.log(await response.json());
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
          {/* <Image src="/contact-us-logo.png" className=""/> */}
          <form
            method="post"
            className="space-y-6"
            data-parsley-validate=""
            onSubmit={sendMail}
          >
            <h2 className="text-xl xl:text-2xl font-semibold mb-4">
              Please indicate who you want to add or remove from your startup.
              You should include the full names and email addresses.
            </h2>

            <div className="p-6 bg-slate-100 rounded-md text-sm">
              {/* <p className="text-md font-bold mb-5"> Please indicate who you want to add or remove from your startup.
              You should include the full names and email addresses. </p> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="FIRST NAME"
                  className="border-gray-300 rounded-lg p-3 w-full"
                  value={first_name}
                  onChange={(e) => {
                    set_first_name(e.target.value);
                  }}
                  data-parsley-type="alphanum"
                  data-parsley-trigger="change"
                  required={true}
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="LAST NAME"
                  className="border-gray-300 rounded-lg p-3 w-full"
                  value={last_name}
                  onChange={(e) => {
                    set_last_name(e.target.value);
                  }}
                  data-parsley-type="alphanum"
                  data-parsley-trigger="change"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  className="border-gray-300 rounded-lg p-3 w-full"
                  value={email}
                  onChange={(e) => {
                    set_email(e.target.value);
                  }}
                  data-parsley-type="email"
                  data-parsley-trigger="change"
                  required={true}
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="PHONE"
                  className="border-gray-300 rounded-lg p-3 w-full"
                  value={phone}
                  onChange={(e) => {
                    set_phone(e.target.value);
                  }}
                  data-parsley-type="number"
                  data-parsley-trigger="change"
                  required={true}
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="MESSAGE"
                  className="border-gray-300 rounded-lg p-3 w-full h-64"
                  value={message}
                  onChange={(e) => {
                    set_message(e.target.value);
                  }}
                  data-parsley-trigger="change"
                  required={true}
                ></textarea>
              </div>
              {/* Recaptcha placeholder */}
              {/* <div
                className="g-recaptcha my-4"
                data-sitekey="6LeHRmcUAAAAABoIiygckcbVx12yY-No_30jmIBe"
              ></div> */}
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  color="primary"
                  className="text-white font-bold rounded"
                >
                  SUBMIT
                </Button>
              </div>
        
            </div>
          </form>
        </div>
        <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0 flex flex-col">
          <iframe
            className="w-full min-h-[300px] flex-1"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4059084760215!2d-79.398950784502!3d43.660527279120956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c759aac983%3A0x22314ceb9e69c275!2s55+St+George+St%2C+Toronto%2C+ON+M5S+1A4!5e0!3m2!1sen!2sca!4v1531237441449"
            allowFullScreen
          ></iframe>
          <div className="mt-4 mb-4">
            <p className="text-lg font-semibold">
              The Entrepreneurship Hatchery
            </p>
            <p>55 St.George Street, Suite 620</p>
            <p>Toronto, ON M5S 1A4</p>
            <br />
            <p>Find us at the Myhal Centre on St.George Street (MY620)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <div>
        <HatcheryNavigation />
        <Section1 />
      </div>
    </main>
  );
}
