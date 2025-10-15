"use client";

import React, { useState } from "react";
import { dummyClients } from "@/lib/dummyData";
import { Client, DocumentFile } from "@/interfaces";
import { v4 as uuidv4 } from "uuid";

const DocumentsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(dummyClients);

  const handleAddDocument = (clientId: string, file: File) => {
    const newDoc: DocumentFile = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      uploadDate: new Date().toLocaleDateString(),
      url: URL.createObjectURL(file),
    };

    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? { ...client, documents: [...(client.documents || []), newDoc] }
          : client
      )
    );
  };

  const removeDocument = (clientId: string, docId: string) => {
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
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>

      {clients.map((client) => (
        <div key={client.id} className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">{client.name}</h2>
              <p className="text-sm text-gray-600">{client.email}</p>
            </div>

            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
              + Add Document
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0])
                    handleAddDocument(client.id, e.target.files[0]);
                }}
              />
            </label>
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
                      {doc.type} • Uploaded on {doc.uploadDate}
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
      ))}
    </div>
  );
};

export default DocumentsPage;
