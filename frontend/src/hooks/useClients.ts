// 🪝 Custom Hook for Managing Clients
// This hook provides easy access to all client-related operations

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { 
  GET_ALL_CLIENTS, 
  GET_CLIENT_BY_ID
} from '../graphql/queries';
import { 
  CREATE_CLIENT, 
  UPDATE_CLIENT, 
  DELETE_CLIENT 
} from '../graphql/mutations';
import { Client, ClientInput } from '../types';

// 🪝 Hook for managing clients
export const useClients = () => {
  const client = useApolloClient();

  // 📋 Get all clients
  const { 
    data: clientsData, 
    loading: clientsLoading, 
    error: clientsError,
    refetch: refetchClients 
  } = useQuery(GET_ALL_CLIENTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network', // Use cache but also fetch fresh data
  });

  // ➕ Create a new client
  const [createClient, { loading: createLoading }] = useMutation(CREATE_CLIENT, {
    onCompleted: () => {
      // After creating, refresh the clients list
      refetchClients();
    },
    onError: (error) => {
      console.error('Failed to create client:', error);
    }
  });

  // ✏️ Update an existing client
  const [updateClient, { loading: updateLoading }] = useMutation(UPDATE_CLIENT, {
    onCompleted: () => {
      // After updating, refresh the clients list
      refetchClients();
    },
    onError: (error) => {
      console.error('Failed to update client:', error);
    }
  });

  // 🗑️ Delete a client
  const [deleteClient, { loading: deleteLoading }] = useMutation(DELETE_CLIENT, {
    onCompleted: () => {
      // After deleting, refresh the clients list
      refetchClients();
    },
    onError: (error) => {
      console.error('Failed to delete client:', error);
    }
  });

  // 🔍 Get a specific client by ID
  const getClientById = (id: string) => {
    return useQuery(GET_CLIENT_BY_ID, {
      variables: { id },
      skip: !id,
      fetchPolicy: 'cache-first', // Use cache first for individual clients
    });
  };

  // 📝 Helper function to create a client
  const handleCreateClient = async (clientData: ClientInput): Promise<Client | null> => {
    try {
      const result = await createClient({
        variables: clientData
      });
      return result.data?.createClient || null;
    } catch (error) {
      console.error('Error creating client:', error);
      return null;
    }
  };

  // 📝 Helper function to update a client
  const handleUpdateClient = async (id: string, clientData: ClientInput): Promise<Client | null> => {
    try {
      const result = await updateClient({
        variables: { id, ...clientData }
      });
      return result.data?.updateClient || null;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  };

  // 📝 Helper function to delete a client
  const handleDeleteClient = async (id: string): Promise<boolean> => {
    try {
      await deleteClient({
        variables: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  };

  // 📊 Return all the data and functions
  return {
    // Data
    clients: clientsData?.getAllClients || [],
    clientsLoading,
    clientsError: clientsError?.message,
    
    // Loading states
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Functions
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    getClientById,
    refetchClients,
    
    // Raw mutations (if needed)
    createClientMutation: createClient,
    updateClientMutation: updateClient,
    deleteClientMutation: deleteClient,
    
    // Cache management
    clearCache: () => {
      client.clearStore();
    }
  };
};

// 📝 How this hook works:
// 1. It uses Apollo Client's useQuery and useMutation hooks
// 2. It automatically refreshes data after mutations
// 3. It provides loading states for better UX
// 4. It handles errors gracefully
// 5. It gives you both simple functions and raw mutations
// 6. It uses cache-and-network fetch policy for optimal performance
// 7. It provides cache management utilities
