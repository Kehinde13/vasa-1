"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Task } from "@/interfaces";

interface PlannerCalendarProps {
  tasks: Task[];
}

export default function PlannerCalendar({ tasks }: PlannerCalendarProps) {
  // Convert tasks to FullCalendar events
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    backgroundColor:
      task.priority === "high"
        ? "#F87171" // red
        : task.priority === "medium"
        ? "#FBBF24" // yellow
        : "#34D399", // green
    borderColor: "transparent",
  }));

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white shadow-md rounded-2xl border">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
        📅 Calendar View
      </h2>

      <div className="overflow-x-auto rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.2}
          events={events}
          eventClick={(info) => {
            alert(`Task: ${info.event.title}`);
          }}
          // 🧩 Responsive tweaks
          windowResize={() => {
            const isMobile = window.innerWidth < 640;
            const calendarApi = document.querySelector<HTMLElement>(".fc");
            if (calendarApi) {
              calendarApi.style.fontSize = isMobile ? "0.75rem" : "1rem";
            }
          }}
        />
      </div>

      <style jsx global>{`
        /* Reduce clutter on small screens */
        @media (max-width: 640px) {
          .fc-header-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }

          .fc-toolbar-chunk {
            text-align: center;
          }

          .fc-button {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }

          .fc .fc-daygrid-day-number {
            font-size: 0.75rem;
          }

          .fc .fc-toolbar-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
