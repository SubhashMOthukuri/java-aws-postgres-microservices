package com.Java_AWS_Project.client;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Queue names
    public static final String CLIENT_CREATED_QUEUE = "client.created.queue";
    public static final String CLIENT_UPDATED_QUEUE = "client.updated.queue";
    public static final String CLIENT_DELETED_QUEUE = "client.deleted.queue";
    
    // Exchange names
    public static final String CLIENT_EXCHANGE = "client.exchange";
    
    // Routing keys
    public static final String CLIENT_CREATED_ROUTING_KEY = "client.created";
    public static final String CLIENT_UPDATED_ROUTING_KEY = "client.updated";
    public static final String CLIENT_DELETED_ROUTING_KEY = "client.deleted";

    @Bean
    public Queue clientCreatedQueue() {
        return new Queue(CLIENT_CREATED_QUEUE, true);
    }

    @Bean
    public Queue clientUpdatedQueue() {
        return new Queue(CLIENT_UPDATED_QUEUE, true);
    }

    @Bean
    public Queue clientDeletedQueue() {
        return new Queue(CLIENT_DELETED_QUEUE, true);
    }

    @Bean
    public TopicExchange clientExchange() {
        return new TopicExchange(CLIENT_EXCHANGE);
    }

    @Bean
    public Binding clientCreatedBinding(Queue clientCreatedQueue, TopicExchange clientExchange) {
        return BindingBuilder.bind(clientCreatedQueue)
                .to(clientExchange)
                .with(CLIENT_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding clientUpdatedBinding(Queue clientUpdatedQueue, TopicExchange clientExchange) {
        return BindingBuilder.bind(clientUpdatedQueue)
                .to(clientExchange)
                .with(CLIENT_UPDATED_ROUTING_KEY);
    }

    @Bean
    public Binding clientDeletedBinding(Queue clientDeletedQueue, TopicExchange clientExchange) {
        return BindingBuilder.bind(clientDeletedQueue)
                .to(clientExchange)
                .with(CLIENT_DELETED_ROUTING_KEY);
    }
}
