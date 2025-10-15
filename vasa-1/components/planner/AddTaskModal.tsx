"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import type { Task } from "@/interfaces";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  selectedTask?: Task | null;
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; ownerId: string }[];
}

export default function AddTaskModal({
  open,
  onOpenChange,
  onAddTask,
  onEditTask,
  onDeleteTask,
  selectedTask,
  clients,
  projects,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const isEditing = Boolean(selectedTask);

  // Load selected task data into form when editing
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || "");
      setClientId(selectedTask.clientId || "");
      setProjectId(selectedTask.projectId || "");
      setDueDate(selectedTask.dueDate || "");
      setPriority(selectedTask.priority);
    } else {
      resetForm();
    }
  }, [selectedTask]);

  // 🔍 Filter projects based on selected client
  const filteredProjects = useMemo(() => {
    if (!clientId) return projects;
    return projects.filter((project) => project.ownerId === clientId);
  }, [clientId, projects]);

  const handleSubmit = () => {
    const taskData: Task = {
      id: selectedTask?.id || Date.now().toString(),
      title,
      description,
      clientId,
      projectId,
      dueDate,
      priority,
      status: selectedTask?.status || "todo",
      createdAt: selectedTask?.createdAt || new Date().toISOString(),
    };

    if (isEditing && onEditTask) {
      onEditTask(taskData);
    } else {
      onAddTask(taskData);
    }

    onOpenChange(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedTask && onDeleteTask) {
      onDeleteTask(selectedTask.id);
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClientId("");
    setProjectId("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full border rounded-md p-2 mt-1 text-sm"
            />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full border rounded-md p-2 mt-1 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label>Client</Label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setProjectId("");
                }}
                className="w-full border rounded-md p-2 mt-1 text-sm text-black"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <Label>Project</Label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full border rounded-md p-2 mt-1 text-sm text-black"
                disabled={!clientId || filteredProjects.length === 0}
              >
                <option value="">Select Project</option>
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label>Due Date</Label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded-md p-2 mt-1 text-sm"
              />
            </div>

            <div className="flex-1">
              <Label>Priority</Label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="w-full border rounded-md p-2 mt-1 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center mt-6">
          {isEditing && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-sm"
            >
              Delete
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Save Changes" : "Save Task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
