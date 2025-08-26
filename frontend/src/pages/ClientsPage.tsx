// 👥 Clients Page
// This page lets users view, create, edit, and delete clients

import React, { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientForm } from '@/components/ClientForm';
import { Client, ClientInput } from '@/types';

// 👥 The ClientsPage component
export const ClientsPage: React.FC = () => {
  // 🪝 Use our custom hook for client operations
  const {
    clients,
    clientsLoading,
    clientsError,
    createClient,
    updateClient,
    deleteClient,
    createLoading,
    updateLoading
  } = useClients();

  // 📝 State for managing the form
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  // 📝 Handle form submission for creating/updating
  const handleSubmit = async (data: ClientInput) => {
    if (editingClient) {
      // ✏️ Update existing client
      const updated = await updateClient(editingClient.id.toString(), data);
      if (updated) {
        setShowForm(false);
        setEditingClient(undefined);
      }
    } else {
      // ➕ Create new client
      const created = await createClient(data);
      if (created) {
        setShowForm(false);
      }
    }
  };

  // 📝 Handle form cancellation
  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(undefined);
  };

  // 📝 Handle edit button click
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  // 📝 Handle delete button click
  const handleDelete = async (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      await deleteClient(client.id.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* 📊 Page Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-2">
              Manage your client information
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ Add New Client
          </button>
        </div>
      </div>

      {/* 📝 Client Form */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createLoading || updateLoading}
        />
      )}

      {/* 📋 Clients List */}
      <div className="bg-white rounded-lg shadow-sm">
        {clientsLoading ? (
          // 📝 Loading state
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading clients...</p>
          </div>
        ) : clientsError ? (
          // 📝 Error state
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error loading clients</h3>
              <p className="text-red-600 text-sm mt-1">{clientsError}</p>
            </div>
          </div>
        ) : clients.length === 0 ? (
          // 📝 Empty state
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first client
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ➕ Add Your First Client
            </button>
          </div>
        ) : (
          // 📝 Clients table
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        #{client.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// 📝 How this ClientsPage component works:
// 1. It uses our custom useClients hook for all operations
// 2. It shows a form for creating/editing clients
// 3. It displays clients in a clean table format
// 4. It handles loading, error, and empty states
// 5. It provides edit and delete actions for each client
// 6. It's fully responsive and user-friendly
