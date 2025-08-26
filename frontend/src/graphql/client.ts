// 🔌 Apollo Client Configuration
// This sets up how our frontend talks to our GraphQL services

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
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

// 🔌 Combined Client - for operations that need both services
export const combinedClient = new ApolloClient({
  link: from([errorLink, authLink, clientServiceLink]),
  cache: new InMemoryCache(),
  name: 'combined-service',
  version: '1.0.0',
});

// 📝 How this works:
// 1. We create separate clients for each service
// 2. Each client connects to its own GraphQL endpoint
// 3. The error link catches and logs any errors
// 4. The auth link can add authentication headers
// 5. Each client has its own cache for performance
