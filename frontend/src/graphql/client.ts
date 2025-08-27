// 🔌 Apollo Client Configuration
// This sets up how our frontend talks to our GraphQL services

import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, FieldPolicy, TypePolicy } from '@apollo/client';
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

// JWT token management
const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

// 🔧 Context link - adds JWT authentication headers
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    }
  };
});

// 🗂️ Advanced Cache Configuration
const createAdvancedCache = () => {
  return new InMemoryCache({
    typePolicies: {
      // 📋 Client type policies
      Client: {
        keyFields: ['id'], // Use 'id' as the unique identifier
        fields: {
          // Custom field policies for clients
          name: {
            read(name: string) {
              // Ensure name is always a string
              return name || '';
            }
          },
          email: {
            read(email: string) {
              // Ensure email is always a string
              return email || '';
            }
          }
        }
      },
      
      // 🎯 Goal type policies
      Goal: {
        keyFields: ['id'], // Use 'id' as the unique identifier
        fields: {
          // Custom field policies for goals
          targetAmount: {
            read(amount: number) {
              // Ensure amount is always a number
              return amount || 0;
            }
          }
        }
      },
      
      // 📊 Query type policies for pagination and filtering
      Query: {
        fields: {
          // Cache policy for getAllClients with pagination
          getAllClients: {
            keyArgs: ['filter', 'sort', 'page', 'limit'], // Cache key arguments
            merge(existing = [], incoming, { args }) {
              // Merge strategy for paginated results
              if (args?.page === 1) {
                // First page, replace existing data
                return incoming;
              } else if (args?.page > 1) {
                // Subsequent pages, append to existing data
                return [...existing, ...incoming];
              }
              // No pagination, replace existing data
              return incoming;
            }
          },
          
          // Cache policy for getAllGoals with pagination
          getAllGoals: {
            keyArgs: ['filter', 'sort', 'page', 'limit'], // Cache key arguments
            merge(existing = [], incoming, { args }) {
              // Merge strategy for paginated results
              if (args?.page === 1) {
                // First page, replace existing data
                return incoming;
              } else if (args?.page > 1) {
                // Subsequent pages, append to existing data
                return [...existing, ...incoming];
              }
              // No pagination, replace existing data
              return incoming;
            }
          },
          
          // Cache policy for filtered goals by client
          getGoalsByClient: {
            keyArgs: ['clientId', 'filter', 'sort', 'page', 'limit'], // Cache key arguments
            merge(existing = [], incoming, { args }) {
              // Merge strategy for paginated results
              if (args?.page === 1) {
                // First page, replace existing data
                return incoming;
              } else if (args?.page > 1) {
                // Subsequent pages, append to existing data
                return [...existing, ...incoming];
              }
              // No pagination, replace existing data
              return incoming;
            }
          }
        }
      }
    },
    
    // 🔍 Global cache configuration
    addTypename: true, // Add __typename to all objects
    resultCaching: true, // Enable result caching
    canonizeResults: true, // Canonize results for better cache hits
  });
};

// 🔌 Apollo Client for Client Service
export const clientServiceClient = new ApolloClient({
  link: from([errorLink, authLink, clientServiceLink]),
  cache: createAdvancedCache(),
  name: 'client-service',
  version: '1.0.0',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Handle errors gracefully
      notifyOnNetworkStatusChange: true, // Notify on network status changes
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache first, then network
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// 🔌 Apollo Client for Goal Service
export const goalServiceClient = new ApolloClient({
  link: from([errorLink, authLink, goalServiceLink]),
  cache: createAdvancedCache(),
  name: 'goal-service',
  version: '1.0.0',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
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
  cache: createAdvancedCache(),
  name: 'smart-combined-service',
  version: '1.0.0',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// 🧹 Cache utility functions
export const cacheUtils = {
  // Clear all cache
  clearAllCache: () => {
    combinedClient.clearStore();
    clientServiceClient.clearStore();
    goalServiceClient.clearStore();
  },
  
  // Clear specific cache by type
  clearCacheByType: (typeName: string) => {
    combinedClient.cache.evict({ fieldName: typeName });
    combinedClient.cache.gc(); // Garbage collect
  },
  
  // Reset cache to initial state
  resetCache: () => {
    combinedClient.resetStore();
    clientServiceClient.resetStore();
    goalServiceClient.resetStore();
  },
  
  // Get cache statistics
  getCacheStats: () => {
    const cache = combinedClient.cache;
    return {
      size: cache.extract().length,
      keys: Object.keys(cache.extract()),
    };
  }
};

// 📝 How this enhanced configuration works:
// 1. Advanced InMemoryCache with type policies and field policies
// 2. Pagination support with merge strategies for lists
// 3. Filtering support with cache key arguments
// 4. Better error handling and network status notifications
// 5. Cache-first fetch policy for better performance
// 6. Cache utility functions for manual cache management
// 7. Type-safe cache policies for Client and Goal entities
