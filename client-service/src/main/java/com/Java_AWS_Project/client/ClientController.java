package com.Java_AWS_Project.client;

import com.Java_AWS_Project.client.Client;
import com.Java_AWS_Project.client.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        Client savedClient = clientService.createClient(client);
        return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return new ResponseEntity<>(client, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return new ResponseEntity<>(clientService.getAllClients(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @Valid @RequestBody Client clientDetails) {
        Client updatedClient = clientService.updateClient(id, clientDetails);
        return new ResponseEntity<>(updatedClient, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
