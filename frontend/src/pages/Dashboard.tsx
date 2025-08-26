// 🏠 Dashboard Page
// This page shows an overview of all clients and goals

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '@/graphql/queries';
import { Client, Goal } from '@/types';
import { Link } from 'react-router-dom';

// 🏠 The Dashboard component
export const Dashboard: React.FC = () => {
  // 📊 Fetch dashboard data from both services
  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);

  // 📝 If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 📝 If there's an error, show error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading dashboard</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // 📊 Extract data from the response
  const clients: Client[] = data?.getAllClients || [];
  const goals: Goal[] = data?.getAllGoals || [];

  // 📊 Calculate statistics
  const totalClients = clients.length;
  const totalGoals = goals.length;
  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  // 📊 Get recent clients (last 5)
  const recentClients = clients.slice(-5).reverse();

  // 📊 Get recent goals (last 5)
  const recentGoals = goals.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* 📊 Page Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your microservices data
        </p>
      </div>

      {/* 📊 Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 👥 Total Clients */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
          </div>
        </div>

        {/* 🎯 Total Goals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
            </div>
          </div>
        </div>

        {/* 💰 Total Goal Amount */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goal Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalGoalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 👥 Recent Clients */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
            <Link 
              to="/clients" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentClients.length > 0 ? (
            <div className="space-y-3">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">ID: {client.id}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No clients yet</p>
          )}
        </div>

        {/* 🎯 Recent Goals */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Goals</h3>
            <Link 
              to="/goals" 
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentGoals.length > 0 ? (
            <div className="space-y-3">
              {recentGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{goal.goalName}</p>
                    <p className="text-sm text-gray-600">Client ID: {goal.clientId}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No goals yet</p>
          )}
        </div>
      </div>

      {/* 🚀 Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <Link
            to="/clients"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ Add New Client
          </Link>
          <Link
            to="/goals"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            ➕ Add New Goal
          </Link>
        </div>
      </div>
    </div>
  );
};

// 📝 How this Dashboard component works:
// 1. It fetches data from both GraphQL services
// 2. It shows key statistics in cards
// 3. It displays recent clients and goals
// 4. It provides quick navigation to other pages
// 5. It handles loading and error states gracefully
// 6. It's responsive and looks great on all devices
