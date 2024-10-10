// speaker filter by event not working on speaker page
"use client";
import React, { useState } from "react";
import HatcheryNavigation from "@/app/ui/navigation";
import Link from "next/link";
import Image from "next/image";

const dummyData = [
  {
    id: 1,
    name: "Item 1",
    description: "This is item 1 description.",
    imgsrc: "",
  },
  {
    id: 2,
    name: "Item 2",
    description: "This is item 2 description.",
    imgsrc: "",
  },
  {
    id: 3,
    name: "Item 3",
    description: "This is item 2 description.",
    imgsrc: "",
  },
  {
    id: 4,
    name: "Item 4",
    description: "This is item 2 description.",
    imgsrc: "",
  },

  // Add more items as needed
];

const Section1 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Dummy filter function
  const filteredData = dummyData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        {" "}
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">
          Get to know Hatchery speakers
        </h2>
      </div>
      <div className="my-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap -m-2">
        {filteredData.map((item, index) => (
          // Adjust grid layout classes for desired number of items per row
          <div key={index} className="p-2 sm:w-1/2 md:w-1/3">
            <div className="border flex flex-row items-center p-4">
              <div className="mb-4">
                <Image
                  src="/about-us/robert.png"
                  alt="picture profile"
                  width={150}
                  height={150}
                />
                {/* <Image src={item.imgsrc} alt="picture profile" width={150} height={150} /> */}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="mt-2">{item.description}</p>
                <Link
                  href={`/about-us/speakers/${item.id}`}
                  className="text-blue-500 mt-4 inline-block"
                  id = {`${item.id}`}
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination and filter functionality would be added here */}
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <HatcheryNavigation></HatcheryNavigation>
      <Section1></Section1>
    </main>
  );
}
