package com.Java_AWS_Project.common;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GoalEvent {
    private Long goalId;
    private Long clientId;
    private String eventType;
    private String goalName;
    private BigDecimal targetAmount;
    private LocalDateTime timestamp;

    public GoalEvent() {}

    public GoalEvent(Long goalId, Long clientId, String eventType, String goalName, BigDecimal targetAmount) {
        this.goalId = goalId;
        this.clientId = clientId;
        this.eventType = eventType;
        this.goalName = goalName;
        this.targetAmount = targetAmount;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getGoalId() { return goalId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getGoalName() { return goalName; }
    public void setGoalName(String goalName) { this.goalName = goalName; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "GoalEvent{" +
                "goalId=" + goalId +
                ", clientId=" + clientId +
                ", eventType='" + eventType + '\'' +
                ", goalName='" + goalName + '\'' +
                ", targetAmount=" + targetAmount +
                ", timestamp=" + timestamp +
                '}';
    }
}
