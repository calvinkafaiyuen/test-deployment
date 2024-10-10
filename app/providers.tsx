"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
// import { SessionProvider } from 'next-auth/react';

export function Providers({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const router = useRouter();
    // return <NextUIProvider><SessionProvider>{children}</SessionProvider></NextUIProvider>;
    return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;

}