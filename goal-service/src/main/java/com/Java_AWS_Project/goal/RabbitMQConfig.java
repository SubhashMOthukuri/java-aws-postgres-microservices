package com.Java_AWS_Project.goal;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Queue names
    public static final String GOAL_CREATED_QUEUE = "goal.created.queue";
    public static final String GOAL_UPDATED_QUEUE = "goal.updated.queue";
    public static final String GOAL_DELETED_QUEUE = "goal.deleted.queue";
    
    // Exchange names
    public static final String GOAL_EXCHANGE = "goal.exchange";
    
    // Routing keys
    public static final String GOAL_CREATED_ROUTING_KEY = "goal.created";
    public static final String GOAL_UPDATED_ROUTING_KEY = "goal.updated";
    public static final String GOAL_DELETED_ROUTING_KEY = "goal.deleted";

    @Bean
    public Queue goalCreatedQueue() {
        return new Queue(GOAL_CREATED_QUEUE, true);
    }

    @Bean
    public Queue goalUpdatedQueue() {
        return new Queue(GOAL_UPDATED_QUEUE, true);
    }

    @Bean
    public Queue goalDeletedQueue() {
        return new Queue(GOAL_DELETED_QUEUE, true);
    }

    @Bean
    public TopicExchange goalExchange() {
        return new TopicExchange(GOAL_EXCHANGE);
    }

    @Bean
    public Binding goalCreatedBinding(Queue goalCreatedQueue, TopicExchange goalExchange) {
        return BindingBuilder.bind(goalCreatedQueue)
                .to(goalExchange)
                .with(GOAL_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding goalUpdatedBinding(Queue goalUpdatedQueue, TopicExchange goalExchange) {
        return BindingBuilder.bind(goalUpdatedQueue)
                .to(goalExchange)
                .with(GOAL_UPDATED_ROUTING_KEY);
    }

    @Bean
    public Binding goalDeletedBinding(Queue goalDeletedQueue, TopicExchange goalExchange) {
        return BindingBuilder.bind(goalDeletedQueue)
                .to(goalExchange)
                .with(GOAL_DELETED_ROUTING_KEY);
    }
}
