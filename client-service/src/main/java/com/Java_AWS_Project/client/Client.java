package com.Java_AWS_Project.client;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "clients")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Client {
  
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        @NotBlank(message = "Name is mandatory")
        private String name;
    
        @Email(message = "Email should be valid")
        @NotBlank(message = "Email is mandatory")
        @Column(unique = true)
        private String email;
    
        // Default constructor for Jackson serialization
        public Client() {}
        
        // Parameterized constructor
        public Client(String name, String email) {
            this.name = name;
            this.email = email;
        }
    
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    
        @Override
        public String toString() {
            return "Client{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", email='" + email + '\'' +
                    '}';
        }
}
