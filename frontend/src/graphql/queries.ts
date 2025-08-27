// 🔍 GraphQL Queries
// These are the questions we ask our services to get data

import { gql } from '@apollo/client';

// 📋 Get all clients (basic version - matches backend schema)
export const GET_ALL_CLIENTS = gql`
  query GetAllClients {
    getAllClients {
      id
      name
      email
    }
  }
`;

// 📋 Get a specific client by ID
export const GET_CLIENT_BY_ID = gql`
  query GetClientById($id: ID!) {
    getClient(id: $id) {
      id
      name
      email
    }
  }
`;

// 📋 Get all goals (basic version - matches backend schema)
export const GET_ALL_GOALS = gql`
  query GetAllGoals {
    getAllGoals {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// 📋 Get a specific goal by ID
export const GET_GOAL_BY_ID = gql`
  query GetGoalById($id: ID!) {
    getGoal(id: $id) {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// 📋 Get all goals for a specific client
export const GET_GOALS_BY_CLIENT = gql`
  query GetGoalsByClient($clientId: ID!) {
    getGoalsByClient(clientId: $clientId) {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// 📊 Get dashboard data (using existing backend fields)
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getAllClients {
      id
      name
      email
    }
    getAllGoals {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// 📝 How these queries work:
// 1. All queries match the actual backend GraphQL schema
// 2. Basic CRUD operations for clients and goals
// 3. Dashboard combines existing queries for overview
// 4. No pagination parameters yet (backend doesn't support them)
// 5. No filtering parameters yet (backend doesn't support them)
