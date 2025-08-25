package com.Java_AWS_Project.goal;

import com.Java_AWS_Project.goal.Goal;
import com.Java_AWS_Project.goal.GoalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;
import com.Java_AWS_Project.goal.GoalMessageProducer;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final RestTemplate restTemplate;
    private final GoalMessageProducer messageProducer;
    private final Logger logger = LoggerFactory.getLogger(GoalService.class);
    
    // Client service URL - in a real microservice, this would come from service discovery
    private static final String CLIENT_SERVICE_URL = "http://localhost:8080";

    public GoalService(GoalRepository goalRepository, RestTemplate restTemplate, GoalMessageProducer messageProducer) {
        this.goalRepository = goalRepository;
        this.restTemplate = restTemplate;
        this.messageProducer = messageProducer;
    }

    @CacheEvict(value = {"goals", "goals-by-client"}, allEntries = true)
    public Goal createGoal(Goal goal) {
        // Validate that the client exists before creating the goal
        if (!isClientExists(goal.getClientId())) {
            logger.error("Cannot create goal: Client with ID {} does not exist", goal.getClientId());
            throw new IllegalArgumentException("Client with ID " + goal.getClientId() + " does not exist");
        }
        
        logger.info("Creating goal '{}' for client {}", goal.getGoalName(), goal.getClientId());
        
        Goal savedGoal = goalRepository.save(goal);
        
        // Send RabbitMQ event
        messageProducer.sendGoalCreatedEvent(savedGoal);
        
        return savedGoal;
    }

    @Cacheable(value = "goals-by-client", key = "#clientId", unless = "#result.isEmpty()")
    public List<Goal> getGoalsByClient(Long clientId) {
        long startTime = System.currentTimeMillis();

        // Check if client exists
        if (!isClientExists(clientId)) {  // <-- Make sure this method exists in your service
            logger.error("Cannot fetch goals: Client with ID {} does not exist", clientId);
            throw new IllegalArgumentException("Client with ID " + clientId + " does not exist");
        }

        logger.info("Fetching all goals for client {}", clientId);

        // Fetch goals from repository
        List<Goal> goals = goalRepository.findByClientId(clientId);

        long endTime = System.currentTimeMillis();
        logger.info("Goals fetch completed in {} ms for clientId: {}. Retrieved {} goals", (endTime - startTime), clientId, goals.size());

        return goals;
    }

    @Cacheable(value = "goals", key = "#id", unless = "#result == null")
    public Goal getGoalById(Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Fetching goal by ID: {}", id);
        
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        
        long endTime = System.currentTimeMillis();
        logger.info("Goal fetch completed in {} ms for ID: {}", (endTime - startTime), id);
        
        return goal;
    }

    @Cacheable(value = "goals", key = "'all'", unless = "#result.isEmpty()")
    public List<Goal> getAllGoals() {
        long startTime = System.currentTimeMillis();
        logger.info("Fetching all goals");
        
        List<Goal> goals = goalRepository.findAll();
        
        long endTime = System.currentTimeMillis();
        logger.info("All goals fetch completed in {} ms. Retrieved {} goals", (endTime - startTime), goals.size());
        
        return goals;
    }

    @CacheEvict(value = {"goals", "goals-by-client"}, allEntries = true)
    public Goal updateGoal(Long id, Goal goalDetails) {
        logger.info("Updating goal with ID: {}", id);
        Goal goal = getGoalById(id);
        goal.setGoalName(goalDetails.getGoalName());
        goal.setTargetAmount(goalDetails.getTargetAmount());
        
        Goal updatedGoal = goalRepository.save(goal);
        
        // Send RabbitMQ event
        messageProducer.sendGoalUpdatedEvent(updatedGoal);
        
        return updatedGoal;
    }

    @CacheEvict(value = {"goals", "goals-by-client"}, allEntries = true)
    public void deleteGoal(Long id) {
        logger.info("Deleting goal with ID: {}", id);
        Goal goal = getGoalById(id);
        
        // Store goal info before deletion for the event
        Long goalId = goal.getId();
        Long clientId = goal.getClientId();
        String goalName = goal.getGoalName();
        java.math.BigDecimal targetAmount = goal.getTargetAmount();
        
        goalRepository.delete(goal);
        
        // Send RabbitMQ event
        messageProducer.sendGoalDeletedEvent(goalId, clientId, goalName, targetAmount);
    }
    
    private boolean isClientExists(Long clientId) {
        try {
            String url = CLIENT_SERVICE_URL + "/clients/" + clientId;
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Handle 4xx errors (like 404 Not Found)
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                logger.info("Client with ID {} not found", clientId);
                return false;
            }
            logger.error("HTTP client error checking if client exists: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Error checking if client exists: {}", e.getMessage());
            return false;
        }
    }
}