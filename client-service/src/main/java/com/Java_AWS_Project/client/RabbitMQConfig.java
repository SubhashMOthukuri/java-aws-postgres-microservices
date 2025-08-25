package com.Java_AWS_Project.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
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

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper;
    }

    @Bean
    public MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);
        return converter;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter);
        return rabbitTemplate;
    }
}
