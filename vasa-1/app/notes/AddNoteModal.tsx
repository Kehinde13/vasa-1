"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import { Note } from "./page";

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (note: Note) => void;
  clients: { id: string; name: string }[];
  projects: { id: string; name: string; ownerId: string }[];
}

export default function AddNoteModal({
  open,
  onOpenChange,
  onAddNote,
  clients,
  projects,
}: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFF9C4");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSave = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      color,
      clientId: clientId || undefined,
      projectId: projectId || undefined,
      createdAt: new Date().toISOString(),
    };
    onAddNote(newNote);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("#FFF9C4");
    setClientId("");
    setProjectId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full border rounded-md p-2 mt-1 text-sm"
            />
          </div>

          <div>
            <Label>Content</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full border rounded-md p-2 mt-1 text-sm"
            />
          </div>

          <div>
            <Label>Color</Label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label>Client</Label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border rounded-md p-2 mt-1 text-sm"
              >
                <option value="">None</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <Label>Project</Label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full border rounded-md p-2 mt-1 text-sm"
              >
                <option value="">None</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
