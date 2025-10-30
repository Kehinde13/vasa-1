"use client";
import React, { useState, useEffect } from "react";
import { Client, Project } from "@/interfaces";
import { ProjectModal } from "@/components/common/ProjectModal";
import { AddClientModal } from "@/components/common/ClientModal";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

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
    documents: [],
  });

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    // The modal now handles the API call internally
    // Just refresh the clients list after save
    await fetchClients();
    closeModal();
  };

  const removeProject = async (clientId: string, projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchClients();
      }
    } catch (error) {
      console.error("Error removing project:", error);
    }
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
        documents: [],
      });
    }
    setShowClientModal(true);
  };

  const closeClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleSaveClient = async () => {
    // The modal now handles the API call internally
    // Just refresh the clients list after save
    await fetchClients();
    closeClientModal();
  };

  const deleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client? All projects will also be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchClients();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading clients...</p>
      </div>
    );
  }

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

      {clients.length === 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-8 text-center">
          <p className="text-gray-500">No clients yet. Add your first client to get started!</p>
        </div>
      ) : (
        clients.map((client) => (
          <div key={client.id} className="bg-white shadow-md rounded-2xl p-4 sm:p-6 mb-6">
            {/* Client Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-black">{client.name}</h2>
                <p className="text-xs sm:text-sm text-gray-600">{client.email}</p>
                <p className="text-xs text-gray-500 capitalize">
                  Status: {client.status}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openClientModal(client)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                >
                  Edit Client
                </button>
                <button
                  onClick={() => deleteClient(client.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => openModal(client.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  + Add Project
                </button>
              </div>
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
                          <td className="px-4 py-2">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}
                          </td>
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
                      <p className="text-xs text-gray-600">
                        Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}
                      </p>
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
        ))
      )}

      {/* Modals */}
      {showModal && editingClientId && (
        <ProjectModal
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          onSave={handleSave}
          isEditing={!!editingProject}
          clients={clients}
          clientId={editingClientId}
        />
      )}

      {showClientModal && (
        <AddClientModal 
          onClose={closeClientModal} 
          onSave={handleSaveClient}
          editingClient={editingClient}
          clientFormData={clientFormData}
          setClientFormData={setClientFormData}
        />
      )}
    </div>
  );
}