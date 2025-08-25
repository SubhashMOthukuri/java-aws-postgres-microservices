package com.Java_AWS_Project.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientMessageProducer {

    private static final Logger logger = LoggerFactory.getLogger(ClientMessageProducer.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendClientCreatedEvent(Client client) {
        ClientEvent event = new ClientEvent(
            client.getId(), 
            "CREATED", 
            client.getName(), 
            client.getEmail()
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.CLIENT_EXCHANGE,
            RabbitMQConfig.CLIENT_CREATED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent client created event: {}", event);
    }

    public void sendClientUpdatedEvent(Client client) {
        ClientEvent event = new ClientEvent(
            client.getId(), 
            "UPDATED", 
            client.getName(), 
            client.getEmail()
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.CLIENT_EXCHANGE,
            RabbitMQConfig.CLIENT_UPDATED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent client updated event: {}", event);
    }

    public void sendClientDeletedEvent(Long clientId, String clientName, String clientEmail) {
        ClientEvent event = new ClientEvent(
            clientId, 
            "DELETED", 
            clientName, 
            clientEmail
        );
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.CLIENT_EXCHANGE,
            RabbitMQConfig.CLIENT_DELETED_ROUTING_KEY,
            event
        );
        
        logger.info("Sent client deleted event: {}", event);
    }
}
