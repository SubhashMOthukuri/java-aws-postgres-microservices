package com.Java_AWS_Project.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ClientInput {
    
    @NotBlank(message = "Client name is required")
    @Size(min = 2, max = 50, message = "Client name must be between 2 and 50 characters")
    private String name;
    
    @NotBlank(message = "Client email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    // Default constructor
    public ClientInput() {}
    
    // Parameterized constructor
    public ClientInput(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
