package com.Java_AWS_Project.client;

import com.Java_AWS_Project.client.Client;
import com.Java_AWS_Project.client.ClientService;
import com.Java_AWS_Project.client.security.RequireRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ClientGraphQL {

    private static final Logger logger = LoggerFactory.getLogger(ClientGraphQL.class);
    private final ClientService clientService;

    public ClientGraphQL(ClientService clientService) {
        this.clientService = clientService;
    }

    // ✅ Query: Get all clients - Requires USER role
    @QueryMapping
    @RequireRole("USER")
    public List<Client> getAllClients() {
        logger.info("GraphQL Query: Fetching all clients");
        return clientService.getAllClients();
    }

    // ✅ Query: Get client by ID - Requires USER role
    @QueryMapping
    @RequireRole("USER")
    public Client getClient(@Argument Long id) {
        logger.info("GraphQL Query: Fetching client by id={}", id);
        
        // Validate input parameter
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        
        return clientService.getClientById(id);
    }

    // ✅ Query: Get client by ID (alias) - Requires USER role
    @QueryMapping
    @RequireRole("USER")
    public Client getClientById(@Argument Long id) {
        logger.info("GraphQL Query: Fetching client by id={}", id);
        
        // Validate input parameter
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        
        return clientService.getClientById(id);
    }

    // ✅ Mutation: Create client - Requires USER role
    @MutationMapping
    @RequireRole("USER")
    public Client createClient(@Argument String name, @Argument String email) {
        logger.info("GraphQL Mutation: Creating client with name={}, email={}", name, email);
        
        // Validate input parameters
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Client name cannot be empty");
        }
        if (name.trim().length() < 2) {
            throw new IllegalArgumentException("Client name must be at least 2 characters");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Client email cannot be empty");
        }
        if (!email.trim().contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Create Client entity from validated input
        Client client = new Client(name.trim(), email.trim());
        return clientService.createClient(client);
    }

    // ✅ Mutation: Update client - Requires USER role
    @MutationMapping
    @RequireRole("USER")
    public Client updateClient(@Argument Long id, @Argument String name, @Argument String email) {
        logger.info("GraphQL Mutation: Updating client id={}, name={}, email={}", id, name, email);
        
        // Validate input parameters
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Client name cannot be empty");
        }
        if (name.trim().length() < 2) {
            throw new IllegalArgumentException("Client name must be at least 2 characters");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Client email cannot be empty");
        }
        if (!email.trim().contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Create Client entity from validated input
        Client clientDetails = new Client(name.trim(), email.trim());
        return clientService.updateClient(id, clientDetails);
    }

    // ✅ Mutation: Delete client - Requires ADMIN role (more restrictive)
    @MutationMapping
    @RequireRole("ADMIN")
    public Boolean deleteClient(@Argument Long id) {
        logger.info("GraphQL Mutation: Deleting client id={}", id);
        
        // Validate input parameter
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Client ID must be a positive number");
        }
        
        clientService.deleteClient(id);
        return true;
    }
}
