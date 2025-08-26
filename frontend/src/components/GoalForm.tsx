// 📝 Goal Form Component
// This component lets users create new goals or edit existing ones

import React, { useState, useEffect } from 'react';
import { Goal, GoalInput, Client } from '../types';

// 📝 Props for the GoalForm component
interface GoalFormProps {
  goal?: Goal;                    // If provided, we're editing an existing goal
  clients: Client[];              // List of available clients to choose from
  onSubmit: (data: GoalInput) => void;  // Function to call when form is submitted
  onCancel: () => void;           // Function to call when form is cancelled
  loading?: boolean;              // Whether the form is currently submitting
}

// 📝 The GoalForm component
export const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  clients,
  onSubmit,
  onCancel,
  loading = false
}) => {
  // 📝 State for form fields
  const [formData, setFormData] = useState<GoalInput>({
    clientId: 0,
    goalName: '',
    goalAmount: 0
  });

  // 📝 State for validation errors
  const [errors, setErrors] = useState<{ 
    clientId?: string; 
    goalName?: string; 
    goalAmount?: string; 
  }>({});

  // 📝 When component loads or goal changes, populate form
  useEffect(() => {
    if (goal) {
      setFormData({
        clientId: goal.clientId,
        goalName: goal.goalName,
        goalAmount: goal.targetAmount
      });
    }
  }, [goal]);

  // 📝 Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert clientId and goalAmount to numbers
    const numValue = name === 'clientId' || name === 'goalAmount' 
      ? parseFloat(value) || 0 
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 📝 Validate form data
  const validateForm = (): boolean => {
    const newErrors: { 
      clientId?: string; 
      goalName?: string; 
      goalAmount?: string; 
    } = {};

    // Check if client is selected
    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }

    // Check if goal name is provided
    if (!formData.goalName.trim()) {
      newErrors.goalName = 'Goal name is required';
    }

    // Check if goal amount is valid
    if (formData.goalAmount <= 0) {
      newErrors.goalAmount = 'Goal amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📝 Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // 📝 Render the form
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {goal ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Selection */}
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Client *
          </label>
          <select
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.clientId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value={0}>Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
          )}
        </div>

        {/* Goal Name Input */}
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Name *
          </label>
          <input
            type="text"
            id="goalName"
            name="goalName"
            value={formData.goalName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.goalName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter goal name (e.g., Vacation Fund, House Down Payment)"
            disabled={loading}
          />
          {errors.goalName && (
            <p className="text-red-500 text-sm mt-1">{errors.goalName}</p>
          )}
        </div>

        {/* Goal Amount Input */}
        <div>
          <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.goalAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              disabled={loading}
            />
          </div>
          {errors.goalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.goalAmount}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {goal ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              goal ? 'Update Goal' : 'Create Goal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// 📝 How this component works:
// 1. It can be used for both creating and editing goals
// 2. It shows a dropdown of available clients
// 3. It validates input before submission
// 4. It shows loading states during submission
// 5. It handles errors gracefully
// 6. It's fully controlled by React state
