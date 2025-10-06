"use client";
import React, { useState } from "react";
import { InboxItem } from "@/interfaces";



const initialInbox: InboxItem[] = [
  {
    id: 1,
    title: "Welcome to VAsA 🎉",
    message: "Thanks for joining! Here’s how to get started with your workspace.",
    date: "Today, 9:30 AM",
    read: false,
  },
  {
    id: 2,
    title: "Invoice Reminder",
    message: "Invoice #023 for Client A is overdue by 3 days.",
    date: "Yesterday, 4:10 PM",
    read: false,
  },
  {
    id: 3,
    title: "New Feature Update 🚀",
    message: "We just added project subtasks. Check them out on your Project Board!",
    date: "Sep 20, 2025",
    read: true,
  },
];

export default function InboxPage() {
  const [inbox, setInbox] = useState(initialInbox);

  const toggleRead = (id: number) => {
    setInbox((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item
      )
    );
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>

      <div className="bg-white shadow-md rounded-2xl divide-y">
        {inbox.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${
              item.read ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <div>
              <h2 className="font-semibold text-gray-900">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.message}</p>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
            <button
              onClick={() => toggleRead(item.id)}
              className={`mt-2 sm:mt-0 px-3 py-1 rounded-md text-sm font-medium ${
                item.read
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {item.read ? "Mark Unread" : "Mark Read"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
