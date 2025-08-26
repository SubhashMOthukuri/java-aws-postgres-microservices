# 🚀 Java AWS PostgreSQL Microservices Project

A comprehensive microservices architecture built with Java Spring Boot, featuring GraphQL APIs, RabbitMQ messaging, Redis caching, and event-driven communication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [GraphQL Endpoints](#graphql-endpoints)
- [RabbitMQ Integration](#rabbitmq-integration)
- [Validation & Error Handling](#validation--error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Project Overview

This project demonstrates a modern microservices architecture with:
- **Client Service**: Manages client information and operations
- **Goal Service**: Handles financial goals and tracking
- **Common Module**: Shared utilities, exceptions, and DTOs
- **Event-Driven Communication**: Services communicate via RabbitMQ events
- **GraphQL APIs**: Modern query language for flexible data fetching
- **REST APIs**: Traditional REST endpoints for compatibility

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Goal          │    │   Common        │
│   Service       │    │   Service       │    │   Module        │
│   (Port 8080)   │    │   (Port 8081)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RabbitMQ      │    │   Redis         │    │   H2 Database   │
│   Message       │    │   Cache         │    │   (In-Memory)   │
│   Broker        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

### 🔐 **Authentication & Security**
- Input validation with comprehensive error handling
- Data sanitization and format validation
- Secure API endpoints with proper HTTP methods

### 📊 **Data Management**
- JPA/Hibernate for database operations
- Redis caching for improved performance
- H2 in-memory database for development
- PostgreSQL driver ready for production

### 🔄 **Event-Driven Architecture**
- RabbitMQ message broker integration
- Asynchronous communication between services
- Event publishing and consumption
- Database-independent service communication

### 🌐 **API Support**
- **REST APIs**: Traditional HTTP endpoints
- **GraphQL APIs**: Modern query language support
- **Swagger UI**: Interactive API documentation
- **GraphiQL**: GraphQL playground interface

### 📈 **Performance & Monitoring**
- Redis caching with Spring Cache abstraction
- Performance logging and metrics
- Connection pooling with HikariCP
- Comprehensive logging throughout

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Language** | Java | 17 |
| **Framework** | Spring Boot | 3.2.0 |
| **Build Tool** | Maven | 3.9.11 |
| **Database** | H2 (Dev) / PostgreSQL (Prod) | Latest |
| **Cache** | Redis | Latest |
| **Message Broker** | RabbitMQ | Latest |
| **API** | GraphQL + REST | Latest |
| **Documentation** | Swagger/OpenAPI | 2.3.0 |

## 📁 Project Structure

```
Java_Aws_Postgres/
├── client-service/                 # Client management microservice
│   ├── src/main/java/
│   │   └── com/Java_AWS_Project/client/
│   │       ├── Client.java                    # Client entity
│   │       ├── ClientController.java          # REST API controller
│   │       ├── ClientGraphQL.java             # GraphQL controller
│   │       ├── ClientService.java             # Business logic
│   │       ├── ClientRepository.java          # Data access layer
│   │       ├── ClientMessageProducer.java     # RabbitMQ producer
│   │       ├── ClientMessageConsumer.java     # RabbitMQ consumer
│   │       ├── RabbitMQConfig.java            # RabbitMQ configuration
│   │       └── RedisConfig.java               # Redis configuration
│   └── src/main/resources/
│       ├── application.properties             # Service configuration
│       └── graphql/schema.graphqls           # GraphQL schema
│
├── goal-service/                   # Goal management microservice
│   ├── src/main/java/
│   │   └── com/Java_AWS_Project/goal/
│   │       ├── Goal.java                      # Goal entity
│   │       ├── GoalController.java            # REST API controller
│   │       ├── GoalGraphQL.java               # GraphQL controller
│   │       ├── GoalService.java               # Business logic
│   │       ├── GoalRepository.java            # Data access layer
│   │       ├── GoalMessageProducer.java       # RabbitMQ producer
│   │       ├── GoalMessageConsumer.java       # RabbitMQ consumer
│   │       ├── RabbitMQConfig.java            # RabbitMQ configuration
│   │       └── RedisConfig.java               # Redis configuration
│   └── src/main/resources/
│       ├── application.properties             # Service configuration
│       └── graphql/schema.graphqls           # GraphQL schema
│
├── common/                         # Shared utilities and DTOs
│   └── src/main/java/
│       └── com/Java_AWS_Project/common/
│           ├── ClientEvent.java               # Shared event model
│           ├── GoalEvent.java                 # Shared event model
│           └── GlobalGraphQLExceptionHandler.java # Exception handling
│
└── README.md                       # This file
```

## 🚀 Getting Started

### **Prerequisites**
- Java 17 or higher
- Maven 3.6+
- Redis server
- RabbitMQ server
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/SubhashMOthukuri/java-aws-postgres-microservices.git
   cd java-aws-postgres-microservices
   ```

2. **Install Java 17**
   ```bash
   # macOS with Homebrew
   brew install openjdk@17
   export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
   
   # Verify installation
   java -version
   ```

3. **Install and start Redis**
   ```bash
   # macOS with Homebrew
   brew install redis
   brew services start redis
   ```

4. **Install and start RabbitMQ**
   ```bash
   # macOS with Homebrew
   brew install rabbitmq
   brew services start rabbitmq
   ```

### **Building the Project**

1. **Build common module**
   ```bash
   cd common
   mvn clean install
   ```

2. **Build client service**
   ```bash
   cd ../client-service
   mvn clean package
   ```

3. **Build goal service**
   ```bash
   cd ../goal-service
   mvn clean package
   ```

### **Running the Services**

1. **Start client service (Port 8080)**
   ```bash
   cd client-service
   export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
   java -jar target/client-service-1.0.0.jar
   ```

2. **Start goal service (Port 8081)**
   ```bash
   cd goal-service
   export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
   java -jar target/goal-service-1.0.0.jar
   ```

## 📚 API Documentation

### **Service URLs**
- **Client Service**: http://localhost:8080
- **Goal Service**: http://localhost:8081
- **Swagger UI**: http://localhost:8080/swagger-ui.html (Client), http://localhost:8081/swagger-ui.html (Goal)

### **REST API Endpoints**

#### **Client Service (Port 8080)**
```
GET    /clients           # Get all clients
GET    /clients/{id}      # Get client by ID
POST   /clients           # Create new client
PUT    /clients/{id}      # Update client
DELETE /clients/{id}      # Delete client
```

#### **Goal Service (Port 8081)**
```
GET    /goals             # Get all goals
GET    /goals/{id}        # Get goal by ID
POST   /goals             # Create new goal
PUT    /goals/{id}        # Update goal
DELETE /goals/{id}        # Delete goal
GET    /goals/client/{clientId} # Get goals by client
```

## 🌐 GraphQL Endpoints

### **Client Service GraphQL (Port 8080)**
- **Endpoint**: `http://localhost:8080/graphql`
- **GraphiQL**: `http://localhost:8080/graphiql`

#### **Queries**
```graphql
query {
  getAllClients {
    id
    name
    email
  }
}

query {
  getClient(id: 1) {
    id
    name
    email
  }
}
```

#### **Mutations**
```graphql
mutation {
  createClient(name: "John Doe", email: "john@example.com") {
    id
    name
    email
  }
}

mutation {
  updateClient(id: 1, name: "Jane Doe", email: "jane@example.com") {
    id
    name
    email
  }
}

mutation {
  deleteClient(id: 1)
}
```

### **Goal Service GraphQL (Port 8081)**
- **Endpoint**: `http://localhost:8081/graphql`
- **GraphiQL**: `http://localhost:8081/graphiql`

#### **Queries**
```graphql
query {
  getAllGoals {
    id
    clientId
    goalName
    targetAmount
  }
}

query {
  getGoalsByClient(clientId: 1) {
    id
    clientId
    goalName
    targetAmount
  }
}
```

#### **Mutations**
```graphql
mutation {
  createGoal(clientId: 1, goalName: "Vacation Fund", goalAmount: 5000.0) {
    id
    clientId
    goalName
    targetAmount
  }
}

mutation {
  updateGoal(id: 1, goalName: "Updated Goal", goalAmount: 7500.0) {
    id
    clientId
    goalName
    targetAmount
  }
}

mutation {
  deleteGoal(id: 1)
}
```

## 🐰 RabbitMQ Integration

### **Message Flow**
1. **Client Creation**: Client service creates client → Publishes `ClientEvent` → Goal service consumes
2. **Goal Creation**: Goal service creates goal → Publishes `GoalEvent` → Client service consumes
3. **Event Types**: `CREATED`, `UPDATED`, `DELETED`

### **Queue Configuration**
- **Client Events Queue**: `client.events`
- **Goal Events Queue**: `goal.events`
- **Exchange**: `microservice.events`

### **Testing RabbitMQ**
```bash
# Check queue status
curl -u guest:guest http://localhost:15672/api/queues

# Monitor messages
rabbitmqctl list_queues
```

## ✅ Validation & Error Handling

### **Input Validation**
- **Client Input**: Name (2-50 chars), Email (valid format, max 100 chars)
- **Goal Input**: Client ID (positive), Goal Name (1-100 chars), Amount (> 0)
- **Real-time validation** with clear error messages

### **Error Handling**
- **Global Exception Handler** for consistent error responses
- **GraphQL Error Handling** with proper error codes
- **Validation Errors** with field-specific messages
- **Business Logic Errors** with meaningful descriptions

## 🧪 Testing

### **Manual Testing with curl**

#### **Test Client Service**
```bash
# Get all clients
curl http://localhost:8080/clients

# Create client via GraphQL
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createClient(name: \"Test Client\", email: \"test@client.com\") { id name email } }"}'
```

#### **Test Goal Service**
```bash
# Get all goals
curl http://localhost:8081/goals

# Create goal via GraphQL
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createGoal(clientId: 1, goalName: \"Test Goal\", goalAmount: 1000.0) { id clientId goalName targetAmount } }"}'
```

### **Postman Testing**
1. **Create new request**
2. **Set method to POST**
3. **Set URL to GraphQL endpoint**
4. **Add header**: `Content-Type: application/json`
5. **Set body to raw JSON** with your GraphQL query

## 🚀 Deployment

### **Production Considerations**
- **Database**: Switch from H2 to PostgreSQL
- **Environment Variables**: Configure database URLs, credentials
- **Health Checks**: Implement `/actuator/health` endpoints
- **Logging**: Configure proper log levels and outputs
- **Monitoring**: Add metrics and monitoring endpoints

### **Docker Support**
```dockerfile
# Example Dockerfile for client service
FROM openjdk:17-jre-slim
COPY target/client-service-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 What's Been Accomplished

### ✅ **Completed Features**
- [x] **Microservices Architecture**: Client and Goal services with proper separation
- [x] **GraphQL Implementation**: Full CRUD operations with validation
- [x] **REST API Support**: Traditional HTTP endpoints for compatibility
- [x] **RabbitMQ Integration**: Event-driven communication between services
- [x] **Redis Caching**: Performance optimization with Spring Cache
- [x] **Input Validation**: Comprehensive validation with clear error messages
- [x] **Exception Handling**: Global exception handling for consistent responses
- [x] **Database Integration**: JPA/Hibernate with H2 and PostgreSQL support
- [x] **Swagger Documentation**: Interactive API documentation
- [x] **GraphiQL Interface**: GraphQL playground for testing
- [x] **Maven Build System**: Proper dependency management and packaging
- [x] **Git Version Control**: Complete project history and collaboration

### 🔄 **Current Status**
- **Both services running successfully** on ports 8080 and 8081
- **All GraphQL endpoints working** with proper validation
- **REST APIs functional** and returning data
- **RabbitMQ messaging working** between services
- **Redis caching operational** for performance
- **Input validation implemented** with comprehensive error handling

### 🚀 **Next Steps**
- [ ] **Unit Testing**: Add comprehensive test coverage
- [ ] **Integration Testing**: Test service interactions
- [ ] **Performance Testing**: Load testing and optimization
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Monitoring**: Add metrics and health checks
- [ ] **Documentation**: API documentation and user guides

---

**Project Status**: ✅ **FULLY FUNCTIONAL** - All core features implemented and working!

**Last Updated**: August 26, 2025
**Version**: 1.0.0
**Author**: Subhash Mothukuri
