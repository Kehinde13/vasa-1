"use client";
import React, { useState } from "react";
import { Client } from "@/interfaces";

interface AddClientModalProps {
  onClose: () => void;
  onSave: () => void;
  editingClient?: Client | null;
  clientFormData: Client;
  setClientFormData: (data: Client) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  onClose,
  onSave,
  editingClient,
  clientFormData,
  setClientFormData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!clientFormData.name || !clientFormData.email) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = editingClient
        ? `/api/clients/${editingClient.id}`
        : "/api/clients";
      const method = editingClient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientFormData.name,
          email: clientFormData.email,
          status: clientFormData.status,
          preferences: clientFormData.preferences,
          billing: clientFormData.billing,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save client");
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1000);
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving client:", err);
      setError("Failed to save client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-gray-900 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingClient ? "Edit Client" : "Add New Client"}
        </h2>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800 font-medium">
              Client {editingClient ? "updated" : "created"} successfully!
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Name */}
          <label className="flex flex-col text-sm font-medium">
            Client Name <span className="text-red-500">*</span>
            <input
              type="text"
              placeholder="Enter client name"
              value={clientFormData.name}
              onChange={(e) =>
                setClientFormData({ ...clientFormData, name: e.target.value })
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </label>

          {/* Email */}
          <label className="flex flex-col text-sm font-medium">
            Client Email <span className="text-red-500">*</span>
            <input
              type="email"
              placeholder="Enter client email"
              value={clientFormData.email}
              onChange={(e) =>
                setClientFormData({ ...clientFormData, email: e.target.value })
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </label>

          {/* Status */}
          <label className="flex flex-col text-sm font-medium">
            Status
            <select
              value={clientFormData.status}
              onChange={(e) =>
                setClientFormData({ ...clientFormData, status: e.target.value })
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="paused">Paused</option>
            </select>
          </label>

          {/* Preferences */}
          <label className="flex flex-col text-sm font-medium">
            Theme
            <select
              value={clientFormData.preferences?.theme || "light"}
              onChange={(e) =>
                setClientFormData({
                  ...clientFormData,
                  preferences: {
                    ...clientFormData.preferences,
                    theme: e.target.value,
                  },
                })
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="flex items-center text-sm font-medium gap-2">
            <input
              type="checkbox"
              checked={clientFormData.preferences?.notifications ?? true}
              onChange={(e) =>
                setClientFormData({
                  ...clientFormData,
                  preferences: {
                    ...clientFormData.preferences,
                    notifications: e.target.checked,
                  },
                })
              }
              className="h-4 w-4"
              disabled={isLoading}
            />
            Enable Notifications
          </label>

          {/* Billing */}
          <label className="flex flex-col text-sm font-medium">
            Billing Plan
            <select
              value={clientFormData.billing?.plan || "basic"}
              onChange={(e) =>
                setClientFormData({
                  ...clientFormData,
                  billing: {
                    ...clientFormData.billing,
                    plan: e.target.value,
                  },
                })
              }
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};