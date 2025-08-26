// 📝 Client Form Component
// This component lets users create new clients or edit existing ones

import React, { useState, useEffect } from 'react';
import { Client, ClientInput } from '@/types';

// 📝 Props for the ClientForm component
interface ClientFormProps {
  client?: Client;           // If provided, we're editing an existing client
  onSubmit: (data: ClientInput) => void;  // Function to call when form is submitted
  onCancel: () => void;      // Function to call when form is cancelled
  loading?: boolean;         // Whether the form is currently submitting
}

// 📝 The ClientForm component
export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  loading = false
}) => {
  // 📝 State for form fields
  const [formData, setFormData] = useState<ClientInput>({
    name: '',
    email: ''
  });

  // 📝 State for validation errors
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // 📝 When component loads or client changes, populate form
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email
      });
    }
  }, [client]);

  // 📝 Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const newErrors: { name?: string; email?: string } = {};

    // Check if name is provided
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Check if email is provided and valid
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
        {client ? 'Edit Client' : 'Create New Client'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter client's full name"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter client's email address"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {client ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              client ? 'Update Client' : 'Create Client'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// 📝 How this component works:
// 1. It can be used for both creating and editing clients
// 2. It validates input before submission
// 3. It shows loading states during submission
// 4. It handles errors gracefully
// 5. It's fully controlled by React state
