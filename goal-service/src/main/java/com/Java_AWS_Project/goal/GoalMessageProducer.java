package com.Java_AWS_Project.goal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GoalMessageProducer {

    private static final Logger logger = LoggerFactory.getLogger(GoalMessageProducer.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendGoalCreatedEvent(Goal goal) {
        GoalEvent event = new GoalEvent(
            goal.getId(),
            goal.getClientId(),
            "CREATED",
            goal.getGoalName(),
            goal.getTargetAmount()
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.GOAL_EXCHANGE,
            RabbitMQConfig.GOAL_CREATED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent goal created event: {}", event);
    }

    public void sendGoalUpdatedEvent(Goal goal) {
        GoalEvent event = new GoalEvent(
            goal.getId(),
            goal.getClientId(),
            "UPDATED",
            goal.getGoalName(),
            goal.getTargetAmount()
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.GOAL_EXCHANGE,
            RabbitMQConfig.GOAL_UPDATED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent goal updated event: {}", event);
    }

    public void sendGoalDeletedEvent(Long goalId, Long clientId, String goalName, java.math.BigDecimal targetAmount) {
        GoalEvent event = new GoalEvent(
            goalId,
            clientId,
            "DELETED",
            goalName,
            targetAmount
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.GOAL_EXCHANGE,
            RabbitMQConfig.GOAL_DELETED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent goal deleted event: {}", event);
    }
}
