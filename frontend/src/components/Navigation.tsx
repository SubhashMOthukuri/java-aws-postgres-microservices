// 🧭 Navigation Component
// This component provides navigation between different pages

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// 🧭 The Navigation component
export const Navigation: React.FC = () => {
  const location = useLocation();

  // 📝 Helper function to check if a link is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // 📝 Helper function to get link styles
  const getLinkStyles = (path: string): string => {
    const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    return isActive(path)
      ? `${baseStyles} bg-blue-600 text-white`
      : `${baseStyles} text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 🏠 Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              🚀 Microservices Manager
            </Link>
          </div>

          {/* 🧭 Navigation Links */}
          <div className="flex space-x-2">
            <Link to="/" className={getLinkStyles('/')}>
              🏠 Dashboard
            </Link>
            <Link to="/clients" className={getLinkStyles('/clients')}>
              👥 Clients
            </Link>
            <Link to="/goals" className={getLinkStyles('/goals')}>
              🎯 Goals
            </Link>
          </div>

          {/* ℹ️ Service Status */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Client Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Goal Service</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// 📝 How this Navigation component works:
// 1. It shows the current active page
// 2. It provides easy navigation between pages
// 3. It shows service status indicators
// 4. It has a responsive design
// 5. It uses React Router for navigation
