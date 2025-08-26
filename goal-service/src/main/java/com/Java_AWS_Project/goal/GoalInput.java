package com.Java_AWS_Project.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class GoalInput {
    
    @NotNull(message = "Client ID is required")
    @Positive(message = "Client ID must be a positive number")
    private Long clientId;
    
    @NotBlank(message = "Goal name is required")
    @Size(min = 1, max = 100, message = "Goal name must be between 1 and 100 characters")
    private String goalName;
    
    @NotNull(message = "Goal amount is required")
    @DecimalMin(value = "0.01", message = "Goal amount must be greater than 0")
    private BigDecimal goalAmount;
    
    // Default constructor
    public GoalInput() {}
    
    // Parameterized constructor
    public GoalInput(Long clientId, String goalName, BigDecimal goalAmount) {
        this.clientId = clientId;
        this.goalName = goalName;
        this.goalAmount = goalAmount;
    }
    
    // Getters and Setters
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public String getGoalName() { return goalName; }
    public void setGoalName(String goalName) { this.goalName = goalName; }
    
    public BigDecimal getGoalAmount() { return goalAmount; }
    public void setGoalAmount(BigDecimal goalAmount) { this.goalAmount = goalAmount; }
}
