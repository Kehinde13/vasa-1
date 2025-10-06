"use client";
import React from "react";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="w-full h-14 bg-white border-b shadow-sm flex items-center px-4 md:hidden">
      {/* Mobile: Hamburger + App Name */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Menu size={24} />
      </button>
      <h1 className="ml-4 text-lg font-bold text-gray-800">VAsA</h1>
    </header>
  );
}
