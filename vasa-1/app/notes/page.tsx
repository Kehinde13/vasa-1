"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import AddNoteModal from "./AddNoteModal";
import NoteCard from "./NoteCard";
import { dummyClients } from "@/lib/dummyData";

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  clientId?: string;
  projectId?: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clients = dummyClients.map((c) => ({ id: c.id, name: c.name }));
  const projects = dummyClients.flatMap((c) =>
    c.projects.map((p) => ({ id: p.id, name: p.name, ownerId: c.id }))
  );

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) =>
    setNotes((prev) => prev.filter((note) => note.id !== id));

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">🗒️ Sticky Notes</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Note</Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 italic text-center mt-10">
          No notes yet... Click &quot;Add Note&quot; to create one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
        </div>
      )}

      <AddNoteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddNote={handleAddNote}
        clients={clients}
        projects={projects}
      />
    </div>
  );
}
