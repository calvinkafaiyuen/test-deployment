import React, { useMemo } from "react";
import { useSession } from 'next-auth/react';
import { NavbarContent, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";

// Importing necessary types
import { Session } from "next-auth"; // This might need adjustment based on your exact type imports
// Define the props type for UserIcon
interface UserIconProps {
  session: Session | null; // Assuming session can be null
}

export default function UserIcon({ session }: UserIconProps) {
  return (
    <NavbarContent as="div">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={session?.user.name}
              size="sm"
              src={session?.user.image}
              key={session?.user.email}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">{session?.user.email}</p>
            </DropdownItem>
            <DropdownItem href="/redirect" key="dashboard">Dashboard</DropdownItem>
            <DropdownItem href="/signout" key="logout" color="danger">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
    </NavbarContent>
  );
}
