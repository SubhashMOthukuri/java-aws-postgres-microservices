// 🚀 Main App Component
// This is the root component that sets up everything

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { combinedClient } from './graphql/client';
import { Dashboard } from './pages/Dashboard';
import { ClientsPage } from './pages/ClientsPage';
import { GoalsPage } from './pages/GoalsPage';
import { Navigation } from './components/Navigation';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// 🚀 The main App component
function App() {
  return (
    // 🔌 Apollo Provider with combined client for both services
    <ApolloProvider client={combinedClient}>
      {/* 🔐 Authentication Provider */}
      <AuthProvider>
        {/* 🌐 Router for navigation */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* 🧭 Navigation bar */}
            <Navigation />
            
            {/* 📱 Main content area */}
            <main className="container mx-auto px-4 py-8">
              {/* 🛣️ Route definitions */}
              <Routes>
                {/* 🔐 Authentication page - public access */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* 🏠 Dashboard - requires authentication */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* 👥 Clients page - requires authentication */}
                <Route path="/clients" element={
                  <ProtectedRoute>
                    <ClientsPage />
                  </ProtectedRoute>
                } />
                
                {/* 🎯 Goals page - requires authentication */}
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <GoalsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

// 📝 How this App component works:
// 1. It uses a single combined Apollo Client for both services
// 2. The combined client can handle operations for both client and goal services
// 3. It sets up routing with React Router
// 4. It provides a consistent layout with navigation
// 5. It renders different pages based on the current route
