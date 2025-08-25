package com.Java_AWS_Project.client;

import java.time.LocalDateTime;

public class ClientEvent {
    private Long clientId;
    private String eventType;
    private String clientName;
    private String clientEmail;
    private LocalDateTime timestamp;

    public ClientEvent() {}

    public ClientEvent(Long clientId, String eventType, String clientName, String clientEmail) {
        this.clientId = clientId;
        this.eventType = eventType;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "ClientEvent{" +
                "clientId=" + clientId +
                ", eventType='" + eventType + '\'' +
                ", clientName='" + clientName + '\'' +
                ", clientEmail='" + clientEmail + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
