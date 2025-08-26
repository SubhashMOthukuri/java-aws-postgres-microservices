// 🔍 GraphQL Queries
// These are the questions we ask our services to get data

import { gql } from '@apollo/client';

// 📋 Get all clients from the client service
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

// 📋 Get all goals from the goal service
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

// 📊 Get dashboard data (clients and goals count)
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
