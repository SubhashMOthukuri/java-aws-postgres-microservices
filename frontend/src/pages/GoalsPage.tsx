// 🎯 Goals Page
// This page lets users view, create, edit, and delete goals

import React, { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { useClients } from '@/hooks/useClients';
import { GoalForm } from '@/components/GoalForm';
import { Goal, GoalInput } from '@/types';

// 🎯 The GoalsPage component
export const GoalsPage: React.FC = () => {
  // 🪝 Use our custom hooks for operations
  const {
    goals,
    goalsLoading,
    goalsError,
    createGoal,
    updateGoal,
    deleteGoal,
    createLoading,
    updateLoading
  } = useGoals();

  const {
    clients,
    clientsLoading
  } = useClients();

  // 📝 State for managing the form
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  // 📝 Handle form submission for creating/updating
  const handleSubmit = async (data: GoalInput) => {
    if (editingGoal) {
      // ✏️ Update existing goal
      const updated = await updateGoal(editingGoal.id.toString(), data);
      if (updated) {
        setShowForm(false);
        setEditingGoal(undefined);
      }
    } else {
      // ➕ Create new goal
      const created = await createGoal(data);
      if (created) {
        setShowForm(false);
      }
    }
  };

  // 📝 Handle form cancellation
  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(undefined);
  };

  // 📝 Handle edit button click
  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  // 📝 Handle delete button click
  const handleDelete = async (goal: Goal) => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.goalName}"?`)) {
      await deleteGoal(goal.id.toString());
    }
  };

  // 📝 Helper function to get client name by ID
  const getClientName = (clientId: number): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : `Client #${clientId}`;
  };

  // 📝 Helper function to get client email by ID
  const getClientEmail = (clientId: number): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.email : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* 📊 Page Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
            <p className="text-gray-600 mt-2">
              Manage financial goals for your clients
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            ➕ Add New Goal
          </button>
        </div>
      </div>

      {/* 📝 Goal Form */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createLoading || updateLoading}
        />
      )}

      {/* 📋 Goals List */}
      <div className="bg-white rounded-lg shadow-sm">
        {goalsLoading || clientsLoading ? (
          // 📝 Loading state
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading goals...</p>
          </div>
        ) : goalsError ? (
          // 📝 Error state
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error loading goals</h3>
              <p className="text-red-600 text-sm mt-1">{goalsError}</p>
            </div>
          </div>
        ) : goals.length === 0 ? (
          // 📝 Empty state
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first financial goal
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              ➕ Add Your First Goal
            </button>
          </div>
        ) : (
          // 📝 Goals table
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Amount
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
                {goals.map((goal) => (
                  <tr key={goal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {goal.goalName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getClientName(goal.clientId)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getClientEmail(goal.clientId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${goal.targetAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        #{goal.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(goal)}
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

      {/* 📊 Goals Summary */}
      {goals.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{goals.length}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Target Amount</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(goals.map(g => g.clientId)).size}
              </div>
              <div className="text-sm text-gray-600">Clients with Goals</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 📝 How this GoalsPage component works:
// 1. It uses our custom useGoals and useClients hooks
// 2. It shows a form for creating/editing goals
// 3. It displays goals in a clean table format
// 4. It shows client information for each goal
// 5. It handles loading, error, and empty states
// 6. It provides edit and delete actions for each goal
// 7. It shows a summary of all goals
// 8. It's fully responsive and user-friendly
