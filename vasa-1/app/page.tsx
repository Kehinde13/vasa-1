"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session?.user) return null;
  const user = session.user;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-600 mt-2">
          Here’s a quick overview of your workspace today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 cursor-pointer hover:bg-blue-100">
          <h2 className="font-semibold text-blue-800">📩 Inbox</h2>
          <p className="text-sm text-blue-700 mt-1">Check latest updates.</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 cursor-pointer hover:bg-green-100">
          <h2 className="font-semibold text-green-800">👥 Clients</h2>
          <p className="text-sm text-green-700 mt-1">Track new client updates.</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 cursor-pointer hover:bg-yellow-100">
          <h2 className="font-semibold text-yellow-800">📌 Projects</h2>
          <p className="text-sm text-yellow-700 mt-1">Manage active projects.</p>
        </div>
      </div>

      {/* Recently Visited */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Visited</h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between border-b pb-2">
            <span className="text-gray-700">Client Tracker</span>
            <span className="text-xs text-gray-500">2 days ago</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span className="text-gray-700">Project Board</span>
            <span className="text-xs text-gray-500">3 days ago</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-700">Notepad</span>
            <span className="text-xs text-gray-500">5 days ago</span>
          </li>
        </ul>
      </div>

      {/* Getting Started Video */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="aspect-video w-full rounded-xl overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Getting Started Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
