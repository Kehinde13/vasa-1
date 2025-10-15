"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import AddTaskModal from "./AddTaskModal";
import type { Task } from "@/interfaces/index";
import { dummyClients } from "@/lib/dummyData";
import { Edit2, Trash2 } from "lucide-react";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface PlannerBoardProps {
  columns: Record<string, Column>;
  setColumns: React.Dispatch<React.SetStateAction<Record<string, Column>>>;
}

export default function PlannerBoard({ columns, setColumns }: PlannerBoardProps) {
  const clients = dummyClients.map((c) => ({ id: c.id, name: c.name }));
  const projects = dummyClients.flatMap((c) =>
    c.projects.map((p) => ({ id: p.id, name: p.name, ownerId: c.id }))
  );


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Handle drag and drop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destCol.id as Task["status"];

    destTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks },
    });
  };

  const handleAddTask = (colId: string) => {
    setActiveColumn(colId);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (!activeColumn) return;
    setColumns((prev) => ({
      ...prev,
      [activeColumn]: {
        ...prev[activeColumn],
        tasks: [...prev[activeColumn].tasks, task],
      },
    }));
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setColumns((prev) => {
      const newCols = { ...prev };
      for (const col of Object.values(newCols)) {
        const idx = col.tasks.findIndex((t) => t.id === updatedTask.id);
        if (idx !== -1) {
          col.tasks[idx] = updatedTask;
          break;
        }
      }
      return newCols;
    });
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns((prev) => {
      const newCols = { ...prev };
      for (const col of Object.values(newCols)) {
        col.tasks = col.tasks.filter((t) => t.id !== taskId);
      }
      return newCols;
    });
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const getClientName = (clientId?: string) =>
    dummyClients.find((c) => c.id === clientId)?.name || "No Client";

  const getProjectName = (projectId?: string) => {
    const project = dummyClients
      .flatMap((c) => c.projects)
      .find((p) => p.id === projectId);
    return project?.name || "No Project";
  };

  return (
    <div className="p-4 md:p-6">

      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(columns).map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full md:w-1/3 flex-shrink-0 bg-white shadow-md rounded-2xl border"
                >
                  <CardHeader className="font-semibold flex justify-between items-center border-b pb-2">
                    <span>{column.title}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddTask(column.id)}
                    >
                      + Add Task
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-3 min-h-[200px] max-h-[70vh] overflow-y-auto p-3">
                    {column.tasks.length === 0 && (
                      <p className="text-sm text-gray-400 italic text-center mt-4">
                        No tasks yet...
                      </p>
                    )}

                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition text-sm ${
                              snapshot.isDragging ? "bg-blue-100 shadow-lg" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setIsModalOpen(true);
                                  }}
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              <p>
                                🧍‍♀️{" "}
                                <span className="font-medium text-gray-700">
                                  {getClientName(task.clientId)}
                                </span>
                              </p>
                              <p>
                                🧩{" "}
                                <span className="font-medium text-gray-700">
                                  {getProjectName(task.projectId)}
                                </span>
                              </p>
                              {task.dueDate && (
                                <p>
                                  📅{" "}
                                  <span className="font-medium text-gray-700">
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-xs mt-2 inline-block px-2 py-1 rounded-full font-semibold ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddTask={handleSaveTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        selectedTask={selectedTask}
        clients={clients}
        projects={projects}
      />
    </div>
  );
}
