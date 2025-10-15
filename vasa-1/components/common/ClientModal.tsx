"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Client } from "@/interfaces";

interface AddClientModalProps {
  onClose: () => void;
  onSave: (client: Client) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  onSave,
}) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro" | "enterprise">("free");

  const handleSubmit = () => {
    if (!clientName || !clientEmail) return;

    const newClient: Client = {
      id: uuidv4(),
      name: clientName,
      email: clientEmail,
      status: "active",
      projects: [],
      preferences: {
        theme,
        notifications,
      },
      billing: {
        plan,
      },
      documents: [],
    };

    onSave(newClient);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-gray-900"
        onClick={(e) => e.stopPropagation()} // ✅ prevents closing when clicking inside
      >
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <label className="flex flex-col text-sm font-medium">
            Client Name
            <input
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col text-sm font-medium">
            Client Email
            <input
              type="email"
              placeholder="Enter client email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* Status */}
          <label className="flex flex-col text-sm font-medium">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          {/* Preferences */}
          <label className="flex flex-col text-sm font-medium">
            Theme
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="flex items-center text-sm font-medium gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4"
            />
            Enable Notifications
          </label>

          {/* Billing */}
          <label className="flex flex-col text-sm font-medium">
            Billing Plan
            <select
              value={plan}
              onChange={(e) =>
                setPlan(e.target.value as "free" | "pro" | "enterprise")
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
