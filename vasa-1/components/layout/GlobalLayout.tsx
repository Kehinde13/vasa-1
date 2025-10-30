"use client";

import React, { useState, useEffect } from "react";
import SidebarNav from "./SidebarNav";
import Navbar from "./NavBar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Allow public routes like /login
  const isPublicPage = pathname === "/login";

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated" && !isPublicPage) {
      router.push("/login");
    }
  }, [status, isPublicPage, router]);

  // Show loader while checking session
  if (status === "loading" && !isPublicPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  // ✅ Public page (no sidebar, no navbar)
  if (isPublicPage) {
    return <>{children}</>;
  }

  // ✅ Authenticated layout (with sidebar and navbar)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarNav open={open} onOpenChange={setOpen} />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar onMenuClick={() => setOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
