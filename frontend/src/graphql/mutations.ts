// ✏️ GraphQL Mutations
// These are the actions we perform to change data in our services

import { gql } from '@apollo/client';

// ➕ Create a new client
export const CREATE_CLIENT = gql`
  mutation CreateClient($name: String!, $email: String!) {
    createClient(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// ✏️ Update an existing client
export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $name: String!, $email: String!) {
    updateClient(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// 🗑️ Delete a client
export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

// ➕ Create a new goal
export const CREATE_GOAL = gql`
  mutation CreateGoal($clientId: ID!, $goalName: String!, $goalAmount: Float!) {
    createGoal(clientId: $clientId, goalName: $goalName, goalAmount: $goalAmount) {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// ✏️ Update an existing goal
export const UPDATE_GOAL = gql`
  mutation UpdateGoal($id: ID!, $clientId: ID!, $goalName: String!, $goalAmount: Float!) {
    updateGoal(id: $id, clientId: $clientId, goalName: $goalName, goalAmount: $goalAmount) {
      id
      clientId
      goalName
      targetAmount
    }
  }
`;

// 🗑️ Delete a goal
export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: ID!) {
    deleteGoal(id: $id)
  }
`;
