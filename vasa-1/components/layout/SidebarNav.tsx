"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import homeIcon from "@/public/assets/icons/home-icon.png";
import inboxIcon from "@/public/assets/icons/inbox-icon.png";
import clientTrackerIcon from "@/public/assets/icons/clientTracker-icon.png";
import deleteIcon from "@/public/assets/icons/delete-icon.png";
import docCenterIcon from "@/public/assets/icons/docCenter-icon.png";
import incomeTrackerIcon from "@/public/assets/icons/incomeTracker-icon.png";
import dailyPlannerIcon from "@/public/assets/icons/dailyPlanner-icon.png";
import settingsIcon from "@/public/assets/icons/settings-icon.png";
import projectBoardIcon from "@/public/assets/icons/projectBoard-icon.png";
import notepadIcon from "@/public/assets/icons/notepad-icon.png";
import { dummyUser } from "@/lib/dummyData";

const topItems = [
  { href: "/", label: "Home", icon: () => <Image src={homeIcon} alt="Home" width={18} height={18} /> },
  { href: "/inbox", label: "Inbox", icon: () => <Image src={inboxIcon} alt="Inbox" width={18} height={18} /> },
];

const middleItems = [
  { href: "/clients", label: "Clients", icon: () => <Image src={clientTrackerIcon} alt="Clients" width={18} height={18} /> },
  { href: "/projects", label: "Projects", icon: () => <Image src={projectBoardIcon} alt="Projects" width={18} height={18} /> },
  { href: "/documents", label: "Documents", icon: () => <Image src={docCenterIcon} alt="Documents" width={18} height={18} /> },
  { href: "/planner", label: "Planner", icon: () => <Image src={dailyPlannerIcon} alt="Planner" width={18} height={18} /> },
  { href: "/invoices", label: "Invoices", icon: () => <Image src={incomeTrackerIcon} alt="Invoices" width={18} height={18} /> },
  { href: "/notes", label: "Notes", icon: () => <Image src={notepadIcon} alt="Notes" width={18} height={18} /> },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: () => <Image src={settingsIcon} alt="Settings" width={18} height={18} /> },
  { href: "/trash", label: "Trash", icon: () => <Image src={deleteIcon} alt="Trash" width={18} height={18} /> },
];

function NavSection({ items, pathname, onClick }: { items: typeof topItems; pathname: string; onClick?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100",
              active && "bg-blue-100 text-blue-700 font-medium"
            )}
          >
            <Icon />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function UserProfile() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Profile Picture Placeholder */}
      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
        {dummyUser.fullName.split(" ").map((n) => n[0]).join("")}
      </div>
      {/* Username */}
      <div>
        <p className="font-medium text-gray-800">{dummyUser.fullName}</p>
        <p className="text-sm text-gray-500">{dummyUser.role}</p>
      </div>
    </div>
  );
}

export default function SidebarNav({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
          <div>
            <UserProfile />
            <NavSection items={topItems} pathname={pathname} />
            <div className="mt-4">
              <NavSection items={middleItems} pathname={pathname} />
            </div>
          </div>
          <NavSection items={bottomItems} pathname={pathname} />
        </aside>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col justify-between z-50"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl text-black font-bold">VAsA</h1>
                  <button onClick={() => setOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                <UserProfile />
                <NavSection items={topItems} pathname={pathname} onClick={() => setOpen(false)} />
                <div className="mt-4">
                  <NavSection items={middleItems} pathname={pathname} onClick={() => setOpen(false)} />
                </div>
              </div>

              <NavSection items={bottomItems} pathname={pathname} onClick={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
