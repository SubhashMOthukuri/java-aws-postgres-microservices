package com.Java_AWS_Project.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Java_AWS_Project.common.ClientEvent;
import com.Java_AWS_Project.common.GlobalExceptionHandler;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * AWS Lambda function for processing client events
 * This function can be triggered by:
 * - API Gateway
 * - EventBridge
 * - SQS
 * - Step Functions
 */
public class ClientProcessor implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SnsClient snsClient = SnsClient.builder().build();
    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            context.getLogger().log("Processing client event: " + input.getBody());
            
            // Parse the client event
            ClientEvent clientEvent = objectMapper.readValue(input.getBody(), ClientEvent.class);
            
            // Process the client event based on action
            String result = processClientEvent(clientEvent, context);
            
            // Publish notification to SNS
            publishNotification(clientEvent, result, context);
            
            // Return success response
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Type", "application/json");
            
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(headers)
                    .withBody("{\"message\": \"Client processed successfully\", \"result\": \"" + result + "\"}");
                    
        } catch (Exception e) {
            context.getLogger().log("Error processing client event: " + e.getMessage());
            
            // Use the common exception handler
            String errorResponse = exceptionHandler.handleException(e);
            
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Type", "application/json");
            
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(500)
                    .withHeaders(headers)
                    .withBody(errorResponse);
        }
    }

    /**
     * Process client event based on the action type
     */
    private String processClientEvent(ClientEvent clientEvent, Context context) {
        String action = clientEvent.getAction();
        String clientId = clientEvent.getClientId();
        
        context.getLogger().log("Processing client action: " + action + " for client ID: " + clientId);
        
        switch (action.toLowerCase()) {
            case "create":
                return "Client created with ID: " + clientId;
            case "update":
                return "Client updated with ID: " + clientId;
            case "delete":
                return "Client deleted with ID: " + clientId;
            default:
                return "Unknown action: " + action + " for client ID: " + clientId;
        }
    }

    /**
     * Publish notification to SNS topic
     */
    private void publishNotification(ClientEvent clientEvent, String result, Context context) {
        try {
            String topicArn = System.getenv("SNS_TOPIC_ARN");
            if (topicArn != null && !topicArn.isEmpty()) {
                String message = String.format(
                    "Client Event Processed: %s - Client ID: %s - Result: %s",
                    clientEvent.getAction(),
                    clientEvent.getClientId(),
                    result
                );
                
                PublishRequest publishRequest = PublishRequest.builder()
                        .topicArn(topicArn)
                        .message(message)
                        .subject("Client Processing Notification")
                        .build();
                
                PublishResponse publishResponse = snsClient.publish(publishRequest);
                context.getLogger().log("Notification published to SNS: " + publishResponse.messageId());
            }
        } catch (Exception e) {
            context.getLogger().log("Error publishing to SNS: " + e.getMessage());
            // Don't fail the main function if SNS fails
        }
    }
}
