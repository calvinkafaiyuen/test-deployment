import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:overflow-hidden">
        {children}
    </div>
  );
}