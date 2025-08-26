// 🏷️ TypeScript Type Definitions
// This file defines the shape of our data

// 👤 Client Interface - represents a client in our system
export interface Client {
  id: number;           // Unique identifier for the client
  name: string;         // Client's full name
  email: string;        // Client's email address
}

// 🎯 Goal Interface - represents a financial goal for a client
export interface Goal {
  id: number;           // Unique identifier for the goal
  clientId: number;     // Which client this goal belongs to
  goalName: string;     // Name/description of the goal
  targetAmount: number; // How much money is needed for this goal
}

// 📝 Client Input - for creating/updating clients
export interface ClientInput {
  name: string;         // Client's name (required)
  email: string;        // Client's email (required)
}

// 📝 Goal Input - for creating/updating goals
export interface GoalInput {
  clientId: number;     // Which client this goal is for (required)
  goalName: string;     // Name of the goal (required)
  goalAmount: number;   // Target amount (required)
}

// 🔄 API Response - wrapper for GraphQL responses
export interface ApiResponse<T> {
  data: T;              // The actual data
  loading: boolean;     // Is the request still loading?
  error?: string;       // Any error message
}

// 📊 Dashboard Data - combines clients and goals for the dashboard
export interface DashboardData {
  clients: Client[];    // List of all clients
  goals: Goal[];        // List of all goals
  totalClients: number; // Count of clients
  totalGoals: number;   // Count of goals
}
