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

// 🚀 The main App component
function App() {
  return (
    // 🔌 Apollo Provider with combined client for both services
    <ApolloProvider client={combinedClient}>
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
  );
}

export default App;

// 📝 How this App component works:
// 1. It uses a single combined Apollo Client for both services
// 2. The combined client can handle operations for both client and goal services
// 3. It sets up routing with React Router
// 4. It provides a consistent layout with navigation
// 5. It renders different pages based on the current route
