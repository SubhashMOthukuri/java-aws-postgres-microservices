package com.Java_AWS_Project.goal;

import com.Java_AWS_Project.goal.Goal;
import com.Java_AWS_Project.goal.GoalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class GoalGraphQL {

    private static final Logger logger = LoggerFactory.getLogger(GoalGraphQL.class);
    private final GoalService goalService;

    public GoalGraphQL(GoalService goalService) {
        this.goalService = goalService;
    }

    // ✅ Query: Get all goals
    @QueryMapping
    public List<Goal> getAllGoals() {
        logger.info("GraphQL Query: Fetching all goals");
        return goalService.getAllGoals();
    }

    // ✅ Query: Get goal by ID
    @QueryMapping
    public Goal getGoal(@Argument Long id) {
        logger.info("GraphQL Query: Fetching goal by id={}", id);
        return goalService.getGoalById(id);
    }

    // ✅ Query: Get goals by clientId
    @QueryMapping
    public List<Goal> getGoalsByClient(@Argument Long clientId) {
        logger.info("GraphQL Query: Fetching goals for clientId={}", clientId);
        return goalService.getGoalsByClient(clientId);
    }

    // ✅ Mutation: Create goal
    @MutationMapping
    public Goal createGoal(@Argument Long clientId,
                           @Argument String goalName,
                           @Argument Double goalAmount) {
        logger.info("GraphQL Mutation: Creating goal '{}' for clientId={}, amount={}", goalName, clientId, goalAmount);
        Goal goal = new Goal();
        goal.setClientId(clientId);
        goal.setGoalName(goalName);
        goal.setTargetAmount(java.math.BigDecimal.valueOf(goalAmount));
        return goalService.createGoal(goal);
    }

    // ✅ Mutation: Update goal
    @MutationMapping
    public Goal updateGoal(@Argument Long id,
                           @Argument String goalName,
                           @Argument Double goalAmount) {
        logger.info("GraphQL Mutation: Updating goal id={}, name={}, amount={}", id, goalName, goalAmount);
        Goal goalDetails = new Goal();
        goalDetails.setGoalName(goalName);
        goalDetails.setTargetAmount(java.math.BigDecimal.valueOf(goalAmount));
        return goalService.updateGoal(id, goalDetails);
    }

    // ✅ Mutation: Delete goal
    @MutationMapping
    public Boolean deleteGoal(@Argument Long id) {
        logger.info("GraphQL Mutation: Deleting goal id={}", id);
        goalService.deleteGoal(id);
        return true;
    }
}

