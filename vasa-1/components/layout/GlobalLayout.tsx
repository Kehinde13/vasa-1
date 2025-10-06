"use client";
import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import Navbar from "./NavBar";

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav open={open} setOpen={setOpen} />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Mobile Navbar */}
        <Navbar onMenuClick={() => setOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
