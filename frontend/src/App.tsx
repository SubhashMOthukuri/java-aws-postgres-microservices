// 🚀 Main App Component
// This is the root component that sets up everything

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { clientServiceClient, goalServiceClient } from '@/graphql/client';
import { Dashboard } from '@/pages/Dashboard';
import { ClientsPage } from '@/pages/ClientsPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { Navigation } from '@/components/Navigation';

// 🚀 The main App component
function App() {
  return (
    // 🔌 Apollo Provider for Client Service
    <ApolloProvider client={clientServiceClient}>
      {/* 🔌 Apollo Provider for Goal Service */}
      <ApolloProvider client={goalServiceClient}>
        {/* 🌐 Router for navigation */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* 🧭 Navigation bar */}
            <Navigation />
            
            {/* 📱 Main content area */}
            <main className="container mx-auto px-4 py-8">
              {/* 🛣️ Route definitions */}
              <Routes>
                {/* 🏠 Dashboard - shows overview of everything */}
                <Route path="/" element={<Dashboard />} />
                
                {/* 👥 Clients page - manage clients */}
                <Route path="/clients" element={<ClientsPage />} />
                
                {/* 🎯 Goals page - manage goals */}
                <Route path="/goals" element={<GoalsPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    </ApolloProvider>
  );
}

export default App;

// 📝 How this App component works:
// 1. It wraps everything in Apollo Client providers
// 2. Each service gets its own Apollo Client
// 3. It sets up routing with React Router
// 4. It provides a consistent layout with navigation
// 5. It renders different pages based on the current route
