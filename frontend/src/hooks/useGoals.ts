// 🪝 Custom Hook for Managing Goals
// This hook provides easy access to all goal-related operations

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { 
  GET_ALL_GOALS, 
  GET_GOAL_BY_ID, 
  GET_GOALS_BY_CLIENT
} from '../graphql/queries';
import { 
  CREATE_GOAL, 
  UPDATE_GOAL, 
  DELETE_GOAL 
} from '../graphql/mutations';
import { Goal, GoalInput } from '../types';

// 🪝 Hook for managing goals
export const useGoals = () => {
  const client = useApolloClient();

  // 📋 Get all goals
  const { 
    data: goalsData, 
    loading: goalsLoading, 
    error: goalsError,
    refetch: refetchGoals 
  } = useQuery(GET_ALL_GOALS);

  // ➕ Create a new goal
  const [createGoal, { loading: createLoading }] = useMutation(CREATE_GOAL, {
    onCompleted: () => {
      // After creating, refresh the goals list
      refetchGoals();
    },
    onError: (error) => {
      console.error('Failed to create goal:', error);
    }
  });

  // ✏️ Update an existing goal
  const [updateGoal, { loading: updateLoading }] = useMutation(UPDATE_GOAL, {
    onCompleted: () => {
      // After updating, refresh the goals list
      refetchGoals();
    },
    onError: (error) => {
      console.error('Failed to update goal:', error);
    }
  });

  // 🗑️ Delete a goal
  const [deleteGoal, { loading: deleteLoading }] = useMutation(DELETE_GOAL, {
    onCompleted: () => {
      // After deleting, refresh the goals list
      refetchGoals();
    },
    onError: (error) => {
      console.error('Failed to delete goal:', error);
    }
  });

  // 🔍 Get a specific goal by ID
  const getGoalById = (id: string) => {
    return useQuery(GET_GOAL_BY_ID, {
      variables: { id },
      skip: !id
    });
  };

  // 🔍 Get all goals for a specific client
  const getGoalsByClient = (clientId: string) => {
    return useQuery(GET_GOALS_BY_CLIENT, {
      variables: { clientId },
      skip: !clientId
    });
  };

  // 📝 Helper function to create a goal
  const handleCreateGoal = async (goalData: GoalInput): Promise<Goal | null> => {
    try {
      const result = await createGoal({
        variables: goalData
      });
      return result.data?.createGoal || null;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  };

  // 📝 Helper function to update a goal
  const handleUpdateGoal = async (id: string, goalData: GoalInput): Promise<Goal | null> => {
    try {
      const result = await updateGoal({
        variables: { id, ...goalData }
      });
      return result.data?.updateGoal || null;
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  };

  // 📝 Helper function to delete a goal
  const handleDeleteGoal = async (id: string): Promise<boolean> => {
    try {
      await deleteGoal({
        variables: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  };

  // 📊 Return all the data and functions
  return {
    // Data
    goals: goalsData?.getAllGoals || [],
    goalsLoading,
    goalsError: goalsError?.message,
    
    // Loading states
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Functions
    createGoal: handleCreateGoal,
    updateGoal: handleUpdateGoal,
    deleteGoal: handleDeleteGoal,
    getGoalById,
    getGoalsByClient,
    refetchGoals,
    
    // Raw mutations (if needed)
    createGoalMutation: createGoal,
    updateGoalMutation: updateGoal,
    deleteGoalMutation: deleteGoal
  };
};

// 📝 How this hook works:
// 1. It uses Apollo Client's useQuery and useMutation hooks
// 2. It automatically refreshes data after mutations
// 3. It provides loading states for better UX
// 4. It handles errors gracefully
// 5. It gives you both simple functions and raw mutations
// 6. It can filter goals by client ID
