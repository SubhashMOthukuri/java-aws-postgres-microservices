// 🔌 Apollo Client Configuration
// This sets up how our frontend talks to our GraphQL services

import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// 🚨 Error handling - shows errors in console and handles network issues
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// 🌐 HTTP link for client service (port 8080)
const clientServiceLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// 🌐 HTTP link for goal service (port 8081)
const goalServiceLink = createHttpLink({
  uri: 'http://localhost:8081/graphql',
});

// 🔧 Context link - adds any headers or authentication we might need
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // We can add authentication tokens here later
      // authorization: `Bearer ${getToken()}`,
    }
  };
});

// 🔌 Apollo Client for Client Service
export const clientServiceClient = new ApolloClient({
  link: from([errorLink, authLink, clientServiceLink]),
  cache: new InMemoryCache(),
  name: 'client-service',
  version: '1.0.0',
});

// 🔌 Apollo Client for Goal Service
export const goalServiceClient = new ApolloClient({
  link: from([errorLink, authLink, goalServiceLink]),
  cache: new InMemoryCache(),
  name: 'goal-service',
  version: '1.0.0',
});

// 🔌 Smart Combined Client - routes requests to appropriate service
const smartLink = new ApolloLink((operation, forward) => {
  // Get the operation name to determine which service to use
  const operationName = operation.operationName;
  
  // Route client operations to client service
  if (operationName && (
    operationName.includes('Client') || 
    operationName.includes('client') ||
    operationName === 'getAllClients' ||
    operationName === 'getClientById'
  )) {
    console.log(`🚀 Routing ${operationName} to Client Service (port 8080)`);
    return clientServiceLink.request(operation, forward);
  }
  
  // Route goal operations to goal service
  if (operationName && (
    operationName.includes('Goal') || 
    operationName.includes('goal') ||
    operationName === 'getAllGoals' ||
    operationName === 'getGoalsByClient'
  )) {
    console.log(`🎯 Routing ${operationName} to Goal Service (port 8081)`);
    return goalServiceLink.request(operation, forward);
  }
  
  // Default to client service for unknown operations
  console.log(`🔀 Default routing ${operationName} to Client Service (port 8080)`);
  return clientServiceLink.request(operation, forward);
});

// 🔌 Combined Client - intelligently routes requests to appropriate services
export const combinedClient = new ApolloClient({
  link: from([errorLink, authLink, smartLink]),
  cache: new InMemoryCache(),
  name: 'smart-combined-service',
  version: '1.0.0',
});

// 📝 How this works:
// 1. We create separate clients for each service
// 2. The smart link analyzes operation names to route requests
// 3. Client operations go to port 8080, goal operations go to port 8081
// 4. The error link catches and logs any errors
// 5. The auth link can add authentication headers
// 6. The combined client automatically routes requests to the right service
