"use client";

import { Note } from "./page";
import { Button } from "@/components/common/Button";

export default function NoteCard({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-lg shadow-md text-gray-800 min-h-[150px] relative`}
      style={{
        backgroundColor: note.color,
        transform: "rotate(" + (Math.random() * 2 - 1) + "deg)",
      }}
    >
      <h3 className="font-bold text-sm mb-1">{note.title}</h3>
      <p className="text-xs mb-3">{note.content}</p>

      {(note.clientId || note.projectId) && (
        <div className="text-xs text-gray-700 italic mt-2">
          {note.clientId && <p>👤 Linked to Client</p>}
          {note.projectId && <p>📁 Linked to Project</p>}
        </div>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={onDelete}
        className="absolute top-2 right-2"
      >
        ✖
      </Button>
    </div>
  );
}
