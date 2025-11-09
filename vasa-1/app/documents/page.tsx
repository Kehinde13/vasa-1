"use client";
import React, { useState, useEffect } from "react";
import { Client } from "@/interfaces";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const DocumentsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch clients and their documents
  useEffect(() => {
    const fetchClientsAndDocuments = async () => {
      try {
        // Fetch clients
        const clientsRes = await fetch("/api/clients");
        if (!clientsRes.ok) throw new Error("Failed to fetch clients");
        const clientsData = await clientsRes.json();

        // Fetch documents for each client
        const clientsWithDocs = await Promise.all(
          clientsData.map(async (client: Client) => {
            const docsRes = await fetch(`/api/documents?clientId=${client.id}`);
            if (!docsRes.ok) return { ...client, documents: [] };
            const documents = await docsRes.json();
            return { ...client, documents };
          })
        );

        setClients(clientsWithDocs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsAndDocuments();
  }, []);

  const handleAddDocument = async (clientId: string, file: File) => {
    try {
      setIsCreating(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);

      // Upload file to Supabase Storage and save to database
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload document");
      }

      const newDoc = await response.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, documents: [...(client.documents || []), newDoc] }
            : client
        )
      );

      alert("Document uploaded successfully!");
    } catch (error) {
      console.error("Error adding document:", error);
      alert(`Failed to upload document: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  const createGoogleDoc = async (clientId: string, clientName: string) => {
    if (!session) {
      alert("Please sign in to create documents");
      return;
    }

    setIsCreating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessToken = (session as any).accessToken;

      // Create a new Google Doc
      const response = await fetch(
        "https://docs.googleapis.com/v1/documents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `${clientName} - Document`,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create document");

      const data = await response.json();
      const docUrl = `https://docs.google.com/document/d/${data.documentId}/edit`;

      // Save to database
      const saveResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${clientName} - Document`,
          url: docUrl,
          clientId,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save document");

      const newDoc = await saveResponse.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, documents: [...(client.documents || []), newDoc] }
            : client
        )
      );

      // Open the document
      window.open(docUrl, "_blank");
    } catch (error) {
      console.error("Error creating Google Doc:", error);
      alert("Failed to create Google Doc. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const createGoogleSheet = async (clientId: string, clientName: string) => {
    if (!session) {
      alert("Please sign in to create documents");
      return;
    }

    setIsCreating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessToken = (session as any).accessToken;

      // Create a new Google Sheet
      const response = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              title: `${clientName} - Spreadsheet`,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create spreadsheet");

      const data = await response.json();
      const sheetUrl = data.spreadsheetUrl;

      // Save to database
      const saveResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${clientName} - Spreadsheet`,
          url: sheetUrl,
          clientId,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save document");

      const newDoc = await saveResponse.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, documents: [...(client.documents || []), newDoc] }
            : client
        )
      );

      // Open the spreadsheet
      window.open(sheetUrl, "_blank");
    } catch (error) {
      console.error("Error creating Google Sheet:", error);
      alert("Failed to create Google Sheet. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const createGoogleSlide = async (clientId: string, clientName: string) => {
    if (!session) {
      alert("Please sign in to create documents");
      return;
    }

    setIsCreating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accessToken = (session as any).accessToken;

      // Create a new Google Slide
      const response = await fetch(
        "https://slides.googleapis.com/v1/presentations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `${clientName} - Presentation`,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create presentation");

      const data = await response.json();
      const slideUrl = `https://docs.google.com/presentation/d/${data.presentationId}/edit`;

      // Save to database
      const saveResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${clientName} - Presentation`,
          url: slideUrl,
          clientId,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save document");

      const newDoc = await saveResponse.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, documents: [...(client.documents || []), newDoc] }
            : client
        )
      );

      // Open the presentation
      window.open(slideUrl, "_blank");
    } catch (error) {
      console.error("Error creating Google Slide:", error);
      alert("Failed to create Google Slide. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const createCanvaDesign = async (clientId: string, clientName: string) => {
    try {
      // Canva doesn't have a public API, so we just open Canva
      const canvaUrl = "https://www.canva.com/create";
      window.open(canvaUrl, "_blank");

      // Save a reference to the database
      const saveResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${clientName} - Design`,
          url: canvaUrl,
          clientId,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save document");

      const newDoc = await saveResponse.json();

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, documents: [...(client.documents || []), newDoc] }
            : client
        )
      );
    } catch (error) {
      console.error("Error creating Canva design:", error);
      alert("Failed to save Canva design reference.");
    }
  };

  const removeDocument = async (clientId: string, docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete document");

      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? {
                ...client,
                documents: (client.documents || []).filter(
                  (d) => d.id !== docId
                ),
              }
            : client
        )
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>

      {clients.length === 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-8 text-center">
          <p className="text-gray-500">No clients found. Add clients first to manage documents.</p>
        </div>
      ) : (
        clients.map((client) => (
          <div key={client.id} className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">{client.name}</h2>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>

              <Menu as="div" className="relative inline-block text-left">
                <MenuButton
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={isCreating}
                >
                  <PlusIcon size={16} /> {isCreating ? "Creating..." : "New"}
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 focus:outline-none">
                  <MenuItem>
                    {({ focus }) => (
                      <label
                        className={`flex items-center px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                          focus ? "bg-blue-50 text-blue-700" : "text-gray-700"
                        } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span>📤 Upload file</span>
                        <input
                          type="file"
                          className="hidden"
                          disabled={isCreating}
                          onChange={(e) => {
                            if (e.target.files?.[0])
                              handleAddDocument(client.id, e.target.files[0]);
                          }}
                        />
                      </label>
                    )}
                  </MenuItem>

                  <div className="border-t border-gray-100 my-1"></div>

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => createGoogleDoc(client.id, client.name)}
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                          focus ? "bg-blue-50 text-blue-700" : "text-gray-700"
                        }`}
                      >
                        📄 Google Doc
                      </button>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() =>
                          createGoogleSheet(client.id, client.name)
                        }
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                          focus ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        📊 Google Sheet
                      </button>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() =>
                          createGoogleSlide(client.id, client.name)
                        }
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                          focus
                            ? "bg-yellow-50 text-yellow-700"
                            : "text-gray-700"
                        }`}
                      >
                        📽️ Google Slide
                      </button>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() =>
                          createCanvaDesign(client.id, client.name)
                        }
                        className={`flex items-center w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                          focus
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        🎨 Canva Design
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {(client.documents?.length ?? 0) > 0 ? (
              <ul className="divide-y divide-gray-200">
                {client.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.uploadDate || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={() => removeDocument(client.id, doc.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                No documents for this client yet.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentsPage;