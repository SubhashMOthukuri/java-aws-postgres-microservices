package com.Java_AWS_Project.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;

@Component
@ControllerAdvice
public class GlobalGraphQLExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalGraphQLExceptionHandler.class);

    // Simple exception handler for GraphQL errors
    // Spring Boot GraphQL starter will handle most exceptions automatically
    public void logGraphQLError(Exception ex) {
        logger.error("GraphQL Error occurred: {}", ex.getMessage());
    }
}
