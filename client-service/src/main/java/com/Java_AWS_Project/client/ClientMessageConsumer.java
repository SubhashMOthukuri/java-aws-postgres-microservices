package com.Java_AWS_Project.client;

import com.Java_AWS_Project.common.GoalEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ClientMessageConsumer {

    private static final Logger logger = LoggerFactory.getLogger(ClientMessageConsumer.class);

    @RabbitListener(queues = "goal.created.queue")
    public void handleGoalCreated(GoalEvent goalEvent) {
        logger.info("Client service received goal created event: {}", goalEvent);
        // Here you can add business logic like:
        // - Update client statistics
        // - Send notifications
        // - Update cache
        // - Log analytics
    }

    @RabbitListener(queues = "goal.updated.queue")
    public void handleGoalUpdated(GoalEvent goalEvent) {
        logger.info("Client service received goal updated event: {}", goalEvent);
        // Handle goal updates
    }

    @RabbitListener(queues = "goal.deleted.queue")
    public void handleGoalDeleted(GoalEvent goalEvent) {
        logger.info("Client service received goal deleted event: {}", goalEvent);
        // Handle goal deletions
    }
}
