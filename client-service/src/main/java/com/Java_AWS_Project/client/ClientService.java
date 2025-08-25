package com.Java_AWS_Project.client;

import com.Java_AWS_Project.client.Client;
import com.Java_AWS_Project.client.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional; 


@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMessageProducer messageProducer;
    private final Logger logger = LoggerFactory.getLogger(ClientService.class);

    public ClientService(ClientRepository clientRepository, ClientMessageProducer messageProducer) {
        this.clientRepository = clientRepository;
        this.messageProducer = messageProducer;
    }

    @CacheEvict(value = {"clients", "client-list"}, allEntries = true)
    public Client createClient(Client client) {
        logger.info("Creating client with email: {}", client.getEmail());
        clientRepository.findByEmail(client.getEmail()).ifPresent(c -> {
            throw new RuntimeException("Client with email already exists");
        });
        
        Client savedClient = clientRepository.save(client);
        
        // Send RabbitMQ event
        messageProducer.sendClientCreatedEvent(savedClient);
        
        return savedClient;
    }

    @Cacheable(value = "clients", key = "#id", unless = "#result == null")
    public Client getClientById(Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Fetching client by ID: {}", id);
        
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        long endTime = System.currentTimeMillis();
        logger.info("Client fetch completed in {} ms for ID: {}", (endTime - startTime), id);
        
        return client;
    }

    @Cacheable(value = "client-list", key = "'all'", unless = "#result.isEmpty()")
    public List<Client> getAllClients() {
        long startTime = System.currentTimeMillis();
        logger.info("Fetching all clients");
        
        List<Client> clients = clientRepository.findAll();
        
        long endTime = System.currentTimeMillis();
        logger.info("All clients fetch completed in {} ms. Retrieved {} clients", (endTime - startTime), clients.size());
        
        return clients;
    }

    @CacheEvict(value = {"clients", "client-list"}, allEntries = true)
    public Client updateClient(Long id, Client clientDetails) {
        logger.info("Updating client with ID: {}", id);
        Client client = getClientById(id);
        client.setName(clientDetails.getName());
        client.setEmail(clientDetails.getEmail());
        
        Client updatedClient = clientRepository.save(client);
        
        // Send RabbitMQ event
        messageProducer.sendClientUpdatedEvent(updatedClient);
        
        return updatedClient;
    }

    @CacheEvict(value = {"clients", "client-list"}, allEntries = true)
    public void deleteClient(Long id) {
        logger.info("Deleting client with ID: {}", id);
        Client client = getClientById(id);
        
        // Store client info before deletion for the event
        Long clientId = client.getId();
        String clientName = client.getName();
        String clientEmail = client.getEmail();
        
        clientRepository.delete(client);
        
        // Send RabbitMQ event
        messageProducer.sendClientDeletedEvent(clientId, clientName, clientEmail);
    }
}