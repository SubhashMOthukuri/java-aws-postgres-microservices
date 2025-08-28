package com.Java_AWS_Project.lambda;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Java_AWS_Project.common.GoalEvent;
import com.Java_AWS_Project.common.GlobalExceptionHandler;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * AWS Lambda function for processing goal events
 * This function can be triggered by:
 * - API Gateway
 * - EventBridge
 * - SQS
 * - Step Functions
 */
public class GoalProcessor implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SnsClient snsClient = SnsClient.builder().build();
    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            context.getLogger().log("Processing goal event: " + input.getBody());
            
            // Parse the goal event
            GoalEvent goalEvent = objectMapper.readValue(input.getBody(), GoalEvent.class);
            
            // Process the goal event based on action
            String result = processGoalEvent(goalEvent, context);
            
            // Publish notification to SNS
            publishNotification(goalEvent, result, context);
            
            // Return success response
            Map<String, String> headers = new HashMap<>();
            headers.put("Content-Type", "application/json");
            
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(headers)
                    .withBody("{\"message\": \"Goal processed successfully\", \"result\": \"" + result + "\"}");
                    
        } catch (Exception e) {
            context.getLogger().log("Error processing goal event: " + e.getMessage());
            
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
     * Process goal event based on the action type
     */
    private String processGoalEvent(GoalEvent goalEvent, Context context) {
        String action = goalEvent.getAction();
        String goalId = goalEvent.getGoalId();
        
        context.getLogger().log("Processing goal action: " + action + " for goal ID: " + goalId);
        
        switch (action.toLowerCase()) {
            case "create":
                return "Goal created with ID: " + goalId;
            case "update":
                return "Goal updated with ID: " + goalId;
            case "delete":
                return "Goal deleted with ID: " + goalId;
            case "complete":
                return "Goal completed with ID: " + goalId;
            default:
                return "Unknown action: " + action + " for goal ID: " + goalId;
        }
    }

    /**
     * Publish notification to SNS topic
     */
    private void publishNotification(GoalEvent goalEvent, String result, Context context) {
        try {
            String topicArn = System.getenv("SNS_TOPIC_ARN");
            if (topicArn != null && !topicArn.isEmpty()) {
                String message = String.format(
                    "Goal Event Processed: %s - Goal ID: %s - Result: %s",
                    goalEvent.getAction(),
                    goalEvent.getGoalId(),
                    result
                );
                
                PublishRequest publishRequest = PublishRequest.builder()
                        .topicArn(topicArn)
                        .message(message)
                        .subject("Goal Processing Notification")
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
