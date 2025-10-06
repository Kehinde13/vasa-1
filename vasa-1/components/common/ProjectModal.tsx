"use client";

import React from "react";
import { Input, Button } from "@/components/common";
import { Select } from "./Select";
import { Project, ProjectStatus, Client } from "@/interfaces";

interface ProjectModalProps {
  formData: Project;
  setFormData: React.Dispatch<React.SetStateAction<Project>>;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
  clients: Client[]; // 👈 pass list of clients here
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  formData,
  setFormData,
  onClose,
  onSave,
  isEditing,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
        onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-black"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit Project" : "Add Project"}
        </h2>

        {/* Project Name */}
        <Input
          placeholder="Project name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mb-4"
        />

        {/* Project Status */}
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
          className="mb-4 w-full"
        />


        {/* Due Date */}
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="mb-4"
        />

        {/* Priority Dropdown */}
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
          options={[
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
          ]}
          className="mb-4 w-full"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
