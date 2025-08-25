package com.Java_AWS_Project.goal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class GoalMessageConsumer {

    private static final Logger logger = LoggerFactory.getLogger(GoalMessageConsumer.class);

    @RabbitListener(queues = "client.created.queue")
    public void handleClientCreated(String clientEventMessage) {
        logger.info("Goal service received client created event: {}", clientEventMessage);
        // Here you can add business logic like:
        // - Update goal statistics
        // - Send notifications
        // - Update cache
        // - Log analytics
    }

    @RabbitListener(queues = "client.updated.queue")
    public void handleClientUpdated(String clientEventMessage) {
        logger.info("Goal service received client updated event: {}", clientEventMessage);
        // Handle client updates
    }

    @RabbitListener(queues = "client.deleted.queue")
    public void handleClientDeleted(String clientEventMessage) {
        logger.info("Goal service received client deleted event: {}", clientEventMessage);
        // Handle client deletions
    }
}
