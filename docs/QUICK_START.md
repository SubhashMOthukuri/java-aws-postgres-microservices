# 🚀 Quick Start Guide

## ⚡ **Get Up and Running in 5 Minutes!**

This guide will help you get the microservices running quickly for development and testing.

## 📋 **Prerequisites**

- ✅ **Java 17** - [Install OpenJDK 17](https://adoptium.net/)
- ✅ **Maven 3.6+** - [Install Maven](https://maven.apache.org/install.html)
- ✅ **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- ✅ **Git** - [Install Git](https://git-scm.com/downloads)

## 🚀 **Quick Start Steps**

### **1. Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/SubhashMOthukuri/java-aws-postgres-microservices.git
cd java-aws-postgres-microservices

# Set Java path (macOS)
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Verify Java installation
java -version
```

### **2. Start Infrastructure Services**
```bash
# Start Redis, RabbitMQ, and PostgreSQL
docker-compose up -d

# Verify services are running
docker-compose ps
```

### **3. Build All Modules**
```bash
# Use the build script
./scripts/build-all.sh

# Or build manually:
cd common && mvn clean install && cd ..
cd client-service && mvn clean package && cd ..
cd goal-service && mvn clean package && cd ..
```

### **4. Start Microservices**
```bash
# Use the start script
./scripts/start-services.sh

# Or start manually:
cd client-service
java -jar target/client-service-1.0.0.jar &
cd ../goal-service
java -jar target/goal-service-1.0.0.jar &
```

### **5. Verify Services**
```bash
# Check if services are running
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health

# Test GraphQL endpoints
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { getAllClients { id name email } }"}'
```

## 🌐 **Service URLs**

| Service | Port | REST API | GraphQL | GraphiQL | Swagger |
|---------|------|----------|---------|----------|---------|
| **Client Service** | 8080 | http://localhost:8080/clients | http://localhost:8080/graphql | http://localhost:8080/graphiql | http://localhost:8080/swagger-ui.html |
| **Goal Service** | 8081 | http://localhost:8081/goals | http://localhost:8081/graphql | http://localhost:8081/graphiql | http://localhost:8081/swagger-ui.html |

## 🐰 **Infrastructure Services**

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| **Redis** | 6379 | localhost:6379 | N/A |
| **RabbitMQ** | 5672 | localhost:5672 | N/A |
| **RabbitMQ Management** | 15672 | http://localhost:15672 | guest/guest |
| **PostgreSQL** | 5432 | localhost:5432 | microservice_user/microservice_pass |
| **H2 Console** | 8082 | http://localhost:8082 | N/A |

## 🧪 **Quick Testing**

### **Create a Client via GraphQL**
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createClient(name: \"John Doe\", email: \"john@example.com\") { id name email } }"
  }'
```

### **Create a Goal via GraphQL**
```bash
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createGoal(clientId: 1, goalName: \"Vacation Fund\", goalAmount: 5000.0) { id clientId goalName targetAmount } }"
  }'
```

### **Query All Clients**
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { getAllClients { id name email } }"}'
```

### **Query All Goals**
```bash
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { getAllGoals { id clientId goalName targetAmount } }"}'
```

## 🛠️ **Development Workflow**

### **1. Make Changes**
- Edit Java files in `client-service/` or `goal-service/`
- Update GraphQL schema in `src/main/resources/graphql/schema.graphqls`

### **2. Rebuild and Restart**
```bash
# Rebuild specific service
cd client-service && mvn clean package && cd ..

# Restart service (kill old process first)
pkill -f "client-service"
cd client-service
java -jar target/client-service-1.0.0.jar &
```

### **3. Test Changes**
- Use GraphiQL interface for GraphQL testing
- Use Swagger UI for REST API testing
- Use curl commands for quick testing

## 🚨 **Troubleshooting**

### **Port Already in Use**
```bash
# Find process using port
lsof -i :8080
lsof -i :8081

# Kill process
kill -9 <PID>
```

### **Java Not Found**
```bash
# Set Java path
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Verify installation
java -version
```

### **Services Not Starting**
```bash
# Check logs
tail -f client-service/client-service.log
tail -f goal-service/goal-service.log

# Check infrastructure
docker-compose logs redis
docker-compose logs rabbitmq
```

### **Build Failures**
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Check Java version
java -version
mvn -version
```

## 📚 **Next Steps**

1. **Explore the API**: Use GraphiQL and Swagger UI
2. **Read Documentation**: Check `docs/` folder
3. **Run Tests**: Execute `./scripts/test-all.sh`
4. **Customize**: Modify entities, services, and APIs
5. **Deploy**: Use Docker or cloud platforms

## 🆘 **Need Help?**

- 📖 **Documentation**: Check `docs/` folder
- 🐛 **Issues**: Create GitHub issue
- 💬 **Discussions**: Use GitHub discussions
- 📧 **Contact**: Reach out to the maintainers

---

**🎉 You're all set! Your microservices are running and ready for development!** 🚀
