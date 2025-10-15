"use client";

import { useState } from "react";
import PlannerBoard from "@/components/planner/PlannerBoard";
import PlannerCalendar from "@/components/planner/PlannerCalender";
import { Button } from "@/components/common/Button";
import type { Task } from "@/interfaces";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function PlannerPage() {
  const [view, setView] = useState<"kanban" | "calendar">("kanban");

  const [columns, setColumns] = useState<Record<string, Column>>({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Follow up with Client X",
          description: "Schedule a call to discuss proposal",
          priority: "medium",
          status: "todo",
          clientId: "c1",
          projectId: "p1",
          dueDate: "2025-10-16",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [],
    },
    done: {
      id: "done",
      title: "Completed",
      tasks: [],
    },
  });

  // Gather all tasks from all columns
  const tasks: Task[] = Object.values(columns).flatMap((col) => col.tasks);

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">🧭 Task Planner</h1>
        <Button
          onClick={() =>
            setView((prev) => (prev === "kanban" ? "calendar" : "kanban"))
          }
          variant="outline"
        >
          {view === "kanban" ? "📅 Calendar View" : "🗂️ Kanban View"}
        </Button>
      </div>

      {view === "kanban" ? (
        <PlannerBoard columns={columns} setColumns={setColumns} />
      ) : (
        <PlannerCalendar tasks={tasks} />
      )}
    </div>
  );
}
