"use client";

import React, { useState } from "react";
import { Input, Button } from "@/components/common";
import { Select } from "./Select";
import { Project, ProjectStatus, Client } from "@/interfaces";

interface ProjectModalProps {
  formData: Project;
  setFormData: React.Dispatch<React.SetStateAction<Project>>;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
  clients: Client[];
  clientId: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  formData,
  setFormData,
  onClose,
  onSave,
  isEditing,
  clientId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name) {
      setError("Project name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/projects/${formData.id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        ...(isEditing ? {} : { clientId }), // Only include clientId when creating
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save project");
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1000);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving project:", err);
      setError(err instanceof Error ? err.message : "Failed to save project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit Project" : "Add Project"}
        </h2>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-800 font-medium">
              Project {isEditing ? "updated" : "created"} successfully!
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Project Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as ProjectStatus })
            }
            options={[
              { value: "Not started", label: "Not started" },
              { value: "In progress", label: "In progress" },
              { value: "Done", label: "Done" },
            ]}
            className="w-full"
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Priority Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
            options={[
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
            ]}
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};