"use client";
import React, { useState } from "react";
import { dummyClients } from "@/lib/dummyData";
import { Client, Project } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";
import { ProjectModal } from "@/components/common/ProjectModal";
import { AddClientModal } from "@/components/common/ClientModal";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(dummyClients);

  const [showModal, setShowModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: "",
    name: "",
    ownerId: "",
    status: "Not started",
    dueDate: "",
    priority: "Low",
  });

  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientFormData, setClientFormData] = useState<Client>({
    id: "",
    name: "",
    email: "",
    status: "active",
    projects: [],
    preferences: { notifications: true, theme: "light" },
    billing: { plan: "basic" },
  });

  const openModal = (clientId: string, project?: Project) => {
    setEditingClientId(clientId);
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        id: "",
        name: "",
        ownerId: clientId,
        status: "Not started",
        dueDate: "",
        priority: "Low",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClientId(null);
    setEditingProject(null);
  };

  const handleSave = () => {
    if (!editingClientId) return;

    if (editingProject) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClientId
            ? {
                ...client,
                projects: client.projects.map((p) =>
                  p.id === editingProject.id ? { ...formData, id: editingProject.id } : p
                ),
              }
            : client
        )
      );
    } else {
      const newProject = { ...formData, id: uuidv4() };
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClientId
            ? { ...client, projects: [...client.projects, newProject] }
            : client
        )
      );
    }

    closeModal();
  };

  const removeProject = (clientId: string, projectId: string) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? { ...client, projects: client.projects.filter((p) => p.id !== projectId) }
          : client
      )
    );
  };

  const openClientModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientFormData(client);
    } else {
      setEditingClient(null);
      setClientFormData({
        id: "",
        name: "",
        email: "",
        status: "active",
        projects: [],
        preferences: { notifications: true, theme: "light" },
        billing: { plan: "basic" },
      });
    }
    setShowClientModal(true);
  };

  const closeClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleSaveClient = () => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...clientFormData } : c))
      );
    } else {
      const newClient = { ...clientFormData, id: uuidv4() };
      setClients((prev) => [...prev, newClient]);
    }
    closeClientModal();
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Client Tracker</h1>
        <button
          onClick={() => openClientModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
        >
          + Add Client
        </button>
      </div>

      {clients.map((client) => (
        <div key={client.id} className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-6">
          {/* Client Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black">{client.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600">{client.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                Status: {client.status}
              </p>
            </div>
            <button
              onClick={() => openModal(client.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
            >
              + Add Project
            </button>
          </div>

          {/* Projects */}
          {client.projects.length > 0 ? (
            <>
              {/* Table for large screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg text-sm sm:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Project Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Owner</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Due Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Priority</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.projects.map((project) => (
                      <tr key={project.id} className="border-t hover:bg-gray-50 transition text-gray-700">
                        <td className="px-4 py-2">{project.name}</td>
                        <td className="px-4 py-2">{client.name}</td>
                        <td className="px-4 py-2">{project.status}</td>
                        <td className="px-4 py-2">{project.dueDate}</td>
                        <td className="px-4 py-2">{project.priority}</td>
                        <td className="px-4 py-2 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => openModal(client.id, project)}
                            className="text-blue-500 hover:underline text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeProject(client.id, project.id)}
                            className="text-red-500 hover:underline text-xs sm:text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for small screens */}
              <div className="md:hidden flex flex-col gap-3">
                {client.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className="text-xs text-gray-500">{project.priority}</span>
                    </div>
                    <p className="text-xs text-gray-600">Owner: {client.name}</p>
                    <p className="text-xs text-gray-600">Status: {project.status}</p>
                    <p className="text-xs text-gray-600">Due: {project.dueDate}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openModal(client.id, project)}
                        className="text-blue-500 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeProject(client.id, project.id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">No projects for this client yet.</p>
          )}
        </div>
      ))}

      {/* Modals */}
      {showModal && (
        <ProjectModal
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={handleSave}
          isEditing={!!editingProject}
          clients={clients}
        />
      )}

      {showClientModal && (
        <AddClientModal onClose={closeClientModal} onSave={handleSaveClient} />
      )}
    </div>
  );
}
