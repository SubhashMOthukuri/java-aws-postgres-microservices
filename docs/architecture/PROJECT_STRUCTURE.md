# 🏗️ Project Structure & Architecture

## 📁 Clean Project Organization

```
Java_Aws_Postgres/
├── 📚 docs/                           # Project Documentation
│   ├── 📋 README.md                   # Main project documentation
│   ├── 🏗️ architecture/              # Architecture documentation
│   │   ├── PROJECT_STRUCTURE.md       # This file
│   │   ├── MICROSERVICES_FLOW.md      # Service communication flow
│   │   └── DEPLOYMENT_ARCHITECTURE.md # Deployment architecture
│   ├── 📖 api/                        # API documentation
│   │   ├── REST_API.md                # REST API specifications
│   │   ├── GRAPHQL_API.md             # GraphQL API specifications
│   │   └── EXAMPLES.md                # API usage examples
│   └── 🚀 deployment/                 # Deployment guides
│       ├── DOCKER.md                  # Docker configuration
│       └── AWS_DEPLOYMENT.md          # AWS deployment guide
│
├── ⚙️ config/                         # Configuration files
│   ├── application-dev.properties     # Development configuration
│   ├── application-prod.properties    # Production configuration
│   └── docker-compose.yml             # Docker compose for local development
│
├── 🐳 scripts/                        # Utility scripts
│   ├── start-services.sh              # Start all services
│   ├── stop-services.sh               # Stop all services
│   ├── build-all.sh                   # Build all modules
│   └── test-all.sh                    # Run all tests
│
├── 🔧 common/                         # Shared utilities and DTOs
│   ├── pom.xml                        # Maven configuration
│   └── src/main/java/
│       └── com/Java_AWS_Project/common/
│           ├── 📨 events/             # Event models
│           │   ├── ClientEvent.java   # Client event DTO
│           │   └── GoalEvent.java     # Goal event DTO
│           ├── 🚨 exceptions/         # Exception handling
│           │   └── GlobalGraphQLExceptionHandler.java
│           └── 📊 dto/                # Data Transfer Objects
│               ├── ClientInput.java   # Client input validation
│               └── GoalInput.java     # Goal input validation
│
├── 👥 client-service/                 # Client Management Microservice
│   ├── pom.xml                        # Maven configuration
│   ├── src/main/java/
│   │   └── com/Java_AWS_Project/client/
│   │       ├── 🏗️ config/            # Configuration classes
│   │       │   ├── RabbitMQConfig.java    # RabbitMQ setup
│   │       │   └── RedisConfig.java       # Redis setup
│   │       ├── 📊 entity/             # JPA entities
│   │       │   └── Client.java            # Client entity
│   │       ├── 🗄️ repository/         # Data access layer
│   │       │   └── ClientRepository.java  # Client repository
│   │       ├── 🧠 service/            # Business logic
│   │       │   └── ClientService.java     # Client service
│   │       ├── 🌐 controller/          # API controllers
│   │       │   ├── ClientController.java  # REST API
│   │       │   └── ClientGraphQL.java     # GraphQL API
│   │       ├── 📨 messaging/           # Message handling
│   │       │   ├── ClientMessageProducer.java  # Event producer
│   │       │   └── ClientMessageConsumer.java  # Event consumer
│   │       └── ClientServiceApplication.java    # Main application
│   └── src/main/resources/
│       ├── application.properties     # Service configuration
│       └── graphql/
│           └── schema.graphqls        # GraphQL schema
│
├── 🎯 goal-service/                   # Goal Management Microservice
│   ├── pom.xml                        # Maven configuration
│   ├── src/main/java/
│   │   └── com/Java_AWS_Project/goal/
│   │       ├── 🏗️ config/            # Configuration classes
│   │       │   ├── RabbitMQConfig.java    # RabbitMQ setup
│   │       │   └── RedisConfig.java       # Redis setup
│   │       ├── 📊 entity/             # JPA entities
│   │       │   └── Goal.java              # Goal entity
│   │       ├── 🗄️ repository/         # Data access layer
│   │       │   └── GoalRepository.java    # Goal repository
│   │       ├── 🧠 service/            # Business logic
│   │       │   └── GoalService.java       # Goal service
│   │       ├── 🌐 controller/          # API controllers
│   │       │   ├── GoalController.java    # REST API
│   │       │   └── GoalGraphQL.java      # GraphQL API
│   │       ├── 📨 messaging/           # Message handling
│   │       │   ├── GoalMessageProducer.java   # Event producer
│   │       │   └── GoalMessageConsumer.java   # Event consumer
│   │       └── GoalServiceApplication.java     # Main application
│   └── src/main/resources/
│       ├── application.properties     # Service configuration
│       └── graphql/
│           └── schema.graphqls        # GraphQL schema
│
├── 📋 pom.xml                         # Parent Maven configuration
├── 📖 README.md                       # Main project documentation
├── 📝 .gitignore                      # Git ignore rules
└── 🐳 docker-compose.yml              # Local development setup
```

## 🎯 **Architecture Principles**

### **1. Separation of Concerns**
- **Common Module**: Shared utilities, events, and DTOs
- **Client Service**: Dedicated to client management
- **Goal Service**: Dedicated to goal management
- **Clear boundaries** between services

### **2. Layered Architecture**
Each service follows a clean layered structure:
```
┌─────────────────────────────────────┐
│           Controller Layer          │ ← REST & GraphQL APIs
├─────────────────────────────────────┤
│            Service Layer            │ ← Business Logic
├─────────────────────────────────────┤
│          Repository Layer           │ ← Data Access
├─────────────────────────────────────┤
│           Entity Layer              │ ← Data Models
└─────────────────────────────────────┘
```

### **3. Event-Driven Communication**
```
Client Service ←→ RabbitMQ ←→ Goal Service
     ↑              ↑              ↑
  Publishes    Message Broker   Consumes
  Events       (Events)         Events
```

### **4. Configuration Management**
- **Environment-specific** configuration files
- **Centralized** configuration management
- **Docker-ready** configuration

## 🔄 **Service Communication Flow**

### **Client Creation Flow**
```
1. Client Service receives create request
2. Validates input data
3. Saves to database
4. Publishes ClientEvent to RabbitMQ
5. Goal Service consumes event
6. Updates its client cache/reference
```

### **Goal Creation Flow**
```
1. Goal Service receives create request
2. Validates input data
3. Checks if client exists
4. Saves to database
5. Publishes GoalEvent to RabbitMQ
6. Client Service consumes event
7. Updates its goal references
```

## 🚀 **Benefits of This Structure**

### **✅ Maintainability**
- **Clear separation** of concerns
- **Consistent patterns** across services
- **Easy to locate** specific functionality

### **✅ Scalability**
- **Independent deployment** of services
- **Horizontal scaling** capability
- **Load balancing** ready

### **✅ Testability**
- **Unit testing** for each layer
- **Integration testing** for services
- **End-to-end testing** for flows

### **✅ Development Experience**
- **Clear project structure** for new developers
- **Consistent naming** conventions
- **Well-organized** documentation

## 📊 **Technology Stack Organization**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **API Layer** | Spring Web + GraphQL | HTTP endpoints and GraphQL queries |
| **Service Layer** | Spring Service | Business logic and validation |
| **Data Layer** | Spring Data JPA | Database operations |
| **Cache Layer** | Redis + Spring Cache | Performance optimization |
| **Message Layer** | RabbitMQ + Spring AMQP | Inter-service communication |
| **Config Layer** | Spring Configuration | Environment-specific settings |

## 🎯 **Next Steps for Clean Architecture**

1. **Move DTOs** to appropriate packages
2. **Create interfaces** for services
3. **Add unit tests** for each layer
4. **Implement health checks** for monitoring
5. **Add metrics** and observability
6. **Create deployment** scripts

---

**This structure provides a clean, professional, and scalable foundation for your microservices architecture!** 🚀
