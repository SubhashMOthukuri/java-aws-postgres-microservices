# 🚀 Microservices Manager - Complete Full-Stack Application

A comprehensive microservices application with Spring Boot backend services and React frontend, featuring event-driven architecture, GraphQL APIs, **AWS cloud-native infrastructure**, **Docker containerization**, and modern web technologies.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Client Service │    │  Goal Service   │
│   (React + TS)  │◄──►│   (Port 8080)   │◄──►│   (Port 8081)   │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │    RabbitMQ     │    │   PostgreSQL    │
         │              │   (Port 5672)   │    │   (Port 5432)   │
         └──────────────►└─────────────────┘    └─────────────────┘
                        │                       │
                        ▼                       ▼
              ┌─────────────────┐    ┌─────────────────┐
              │      Redis      │    │   H2 Console    │
              │   (Port 6379)   │    │   (Port 8082)   │
              └─────────────────┘    └─────────────────┘
```

## ☁️ **AWS Cloud-Native Infrastructure**

### **🚀 AWS CDK Stack**
- **Infrastructure as Code**: Complete AWS infrastructure defined in TypeScript
- **Auto-scaling**: ECS Fargate services with auto-scaling policies
- **Load Balancing**: Application Load Balancer with health checks
- **Database**: RDS PostgreSQL with multi-AZ deployment
- **Caching**: ElastiCache Redis cluster
- **Message Queue**: Amazon MQ (RabbitMQ) managed service
- **Monitoring**: CloudWatch logs and metrics
- **Security**: VPC, security groups, and IAM roles

### **🐳 Docker & Containerization**
- **Multi-stage builds**: Optimized production images
- **Development containers**: Hot-reload enabled containers
- **Docker Compose**: Local development environment
- **Kubernetes manifests**: Ready for K8s deployment

## 🎯 **Features**

### **Backend Services**
- **👥 Client Service**: Manage client information with GraphQL and REST APIs
- **🎯 Goal Service**: Handle financial goals with event-driven updates
- **🔄 Event System**: RabbitMQ-based communication between services
- **💾 Data Storage**: H2 in-memory databases with PostgreSQL drivers
- **⚡ Caching**: Redis integration for performance optimization
- **🔍 GraphQL**: Modern query language with GraphiQL playground
- **☁️ AWS Lambda**: Serverless event processors for scalability

### **Frontend Application**
- **⚛️ React 18**: Modern React with TypeScript
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **🔌 Apollo Client**: GraphQL client with smart routing
- **🧭 React Router**: Client-side navigation
- **📱 Responsive Design**: Mobile-first approach
- **🔄 Real-time Updates**: Automatic data refresh
- **🐳 Containerized**: Docker support for easy deployment

### **Infrastructure**
- **🐳 Docker Compose**: Local development environment
- **☁️ AWS CDK**: Cloud infrastructure as code
- **☕ Java 17**: Backend runtime
- **📦 Maven**: Build automation
- **🔄 Event-Driven**: Microservices communication
- **🔒 CORS Enabled**: Cross-origin resource sharing
- **☸️ Kubernetes**: Production deployment ready

## 🚀 **Quick Start**

### **Prerequisites**
- Java 17 (OpenJDK)
- Node.js 18+ and npm
- Docker and Docker Compose
- Maven 3.6+
- AWS CLI (for cloud deployment)
- Node.js 18+ (for AWS CDK)

### **1. Clone and Setup**
```bash
git clone <your-repo-url>
cd Java_Aws_Postgres
```

### **2. Start Infrastructure (Local Development)**
```bash
# Start Redis, RabbitMQ, PostgreSQL, and H2 Console
docker-compose up -d

# Or use the management script
./docker-manage.sh start
```

### **3. Build Backend Services**
```bash
# Build all services with Docker
./build-docker.sh

# Or build manually
cd common && mvn clean install
cd ../client-service && mvn clean package
cd ../goal-service && mvn clean package
```

### **4. Start Backend Services**
```bash
# Start client service (Port 8080)
cd client-service
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
java -jar target/client-service-1.0.0.jar &

# Start goal service (Port 8081)
cd ../goal-service
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
java -jar target/goal-service-1.0.0.jar &
```

### **5. Start Frontend**
```bash
# Install dependencies and start React app
cd frontend
npm install
npm start
```

### **6. Access Your Application**
- **🌐 Frontend Dashboard**: http://localhost:3000
- **👥 Client Service API**: http://localhost:8080
- **🎯 Goal Service API**: http://localhost:8081
- **🔍 GraphQL Playground**: 
  - Client Service: http://localhost:8080/graphiql
  - Goal Service: http://localhost:8081/graphiql
- **💾 H2 Console**: http://localhost:8082 (JDBC: `jdbc:h2:mem:px_client`)

## ☁️ **AWS Cloud Deployment**

### **1. Setup AWS CDK**
```bash
cd aws-cdk
npm install
```

### **2. Configure AWS Credentials**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

### **3. Deploy Infrastructure**
```bash
# Deploy the complete stack
./deploy.sh

# Or deploy manually
npx cdk deploy
```

### **4. Test AWS Services**
```bash
# Test all deployed services
./test-aws-services.sh
```

## 🐳 **Docker Deployment**

### **Development Environment**
```bash
# Start development containers
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### **Production Environment**
```bash
# Build and start production containers
docker-compose up -d

# Scale services
docker-compose up -d --scale client-service=3 --scale goal-service=3
```

### **Individual Service Deployment**
```bash
# Build client service
cd client-service
docker build -f Dockerfile -t client-service:latest .

# Run client service
docker run -p 8080:8080 client-service:latest
```

## ☸️ **Kubernetes Deployment**

### **1. Create Namespace**
```bash
kubectl apply -f k8s/namespace.yaml
```

### **2. Deploy Services**
```bash
# Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Deploy client service
kubectl apply -f k8s/client-service-deployment.yaml

# Apply configuration
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
```

### **3. Check Deployment Status**
```bash
kubectl get pods -n microservices
kubectl get services -n microservices
```

## 🧪 **Testing the System**

### **Create a Client**
1. Go to http://localhost:3000/clients
2. Click "➕ Add New Client"
3. Fill in: Name: `John Doe`, Email: `john@example.com`
4. Click "Create Client"

### **Create a Goal**
1. Go to http://localhost:3000/goals
2. Click "➕ Add New Goal"
3. Select a client, enter goal name and amount
4. Click "Create Goal"

### **Verify Dashboard**
1. Go to http://localhost:3000 (Dashboard)
2. Check total clients and goals
3. View recent data

## 🔧 **Recent Fixes & Improvements**

### **✅ AWS Cloud Infrastructure**
- Complete AWS CDK stack with TypeScript
- ECS Fargate services with auto-scaling
- RDS PostgreSQL and ElastiCache Redis
- Application Load Balancer and VPC setup
- CloudWatch monitoring and logging

### **✅ Docker & Containerization**
- Multi-stage Dockerfiles for all services
- Development and production container configurations
- Docker Compose for local development
- Kubernetes deployment manifests

### **✅ CORS Configuration**
- Added CORS beans to both Spring Boot services
- Enabled cross-origin requests from frontend (localhost:3000)
- Supports all HTTP methods and headers

### **✅ Apollo Client Smart Routing**
- Fixed nested Apollo providers issue
- Implemented intelligent request routing
- Client operations → Port 8080
- Goal operations → Port 8081

### **✅ Event-Driven Communication**
- RabbitMQ message producers and consumers
- Automatic event propagation between services
- Database independence through events
- AWS Lambda processors for scalability

### **✅ GraphQL Integration**
- Complete GraphQL schema definitions
- Mutations for CRUD operations
- Queries for data retrieval
- Input validation and error handling

### **✅ Frontend Architecture**
- React 18 with TypeScript
- Tailwind CSS for styling
- Apollo Client for GraphQL
- Responsive component design

## 📁 **Project Structure**

```
Java_Aws_Postgres/
├── 📁 aws-cdk/                 # AWS CDK infrastructure code
│   ├── 🗂️ bin/                 # CDK app entry point
│   ├── 🗂️ lib/                 # CDK stack definitions
│   ├── 📄 package.json         # Node.js dependencies
│   ├── 📄 deploy.sh            # Deployment script
│   └── 📄 test-aws-services.sh # AWS service testing
├── 📁 client-service/          # Client management microservice
│   ├── 🗂️ src/main/java/      # Java source code
│   ├── 🗂️ src/main/resources/ # Configuration files
│   ├── 🗂️ target/             # Compiled artifacts
│   ├── 📄 Dockerfile           # Production container
│   ├── 📄 Dockerfile.dev       # Development container
│   └── 📄 pom.xml              # Maven dependencies
├── 📁 goal-service/            # Goal management microservice
│   ├── 🗂️ src/main/java/      # Java source code
│   ├── 🗂️ src/main/resources/ # Configuration files
│   ├── 🗂️ target/             # Compiled artifacts
│   ├── 📄 Dockerfile           # Production container
│   ├── 📄 Dockerfile.dev       # Development container
│   └── 📄 pom.xml              # Maven dependencies
├── 📁 common/                  # Shared components and DTOs
│   ├── 🗂️ src/main/java/      # Common Java classes
│   ├── 🗂️ target/             # Compiled artifacts
│   ├── 📄 Dockerfile           # Common service container
│   └── 📄 pom.xml              # Maven dependencies
├── 📁 frontend/                # React frontend application
│   ├── 🗂️ src/                # React source code
│   │   ├── 🗂️ components/     # Reusable UI components
│   │   ├── 🗂️ pages/          # Page components
│   │   ├── 🗂️ hooks/          # Custom React hooks
│   │   ├── 🗂️ graphql/        # GraphQL queries and client
│   │   └── 🗂️ types/          # TypeScript type definitions
│   ├── 🗂️ public/             # Static assets
│   ├── 📄 Dockerfile           # Production container
│   ├── 📄 Dockerfile.dev       # Development container
│   ├── 📄 nginx.conf           # Nginx configuration
│   ├── 📄 package.json         # Node.js dependencies
│   ├── 📄 tsconfig.json        # TypeScript configuration
│   └── 📄 tailwind.config.js   # Tailwind CSS configuration
├── 📁 k8s/                     # Kubernetes manifests
│   ├── 📄 namespace.yaml       # Kubernetes namespace
│   ├── 📄 postgres-deployment.yaml # PostgreSQL deployment
│   ├── 📄 client-service-deployment.yaml # Client service deployment
│   ├── 📄 configmap.yaml       # Configuration
│   └── 📄 secrets.yaml         # Secrets management
├── 📁 docs/                    # Documentation
│   ├── 📄 QUICK_START.md      # Quick start guide
│   ├── 📄 architecture/        # Architecture documentation
│   └── 📄 PROJECT_STRUCTURE.md # Project organization
├── 📁 scripts/                 # Utility scripts
│   ├── 📄 start-services.sh    # Start backend services
│   └── 📄 build-all.sh         # Build all modules
├── 📄 docker-compose.yml       # Production Docker setup
├── 📄 docker-compose.dev.yml   # Development Docker setup
├── 📄 build-docker.sh          # Docker build script
├── 📄 docker-manage.sh         # Docker management script
├── 📄 AWS_IMPLEMENTATION_GUIDE.md # AWS deployment guide
├── 📄 DOCKER_README.md         # Docker usage guide
├── 📄 README.md                # This file
└── 📄 .gitignore               # Git ignore rules
```

## 🔌 **API Endpoints**

### **Client Service (Port 8080)**
- **GraphQL**: `/graphql`
- **GraphiQL**: `/graphiql`
- **Health Check**: `/actuator/health`

### **Goal Service (Port 8081)**
- **GraphQL**: `/graphql`
- **GraphiQL**: `/graphiql`
- **Health Check**: `/actuator/health`

### **GraphQL Operations**
```graphql
# Create Client
mutation {
  createClient(name: "John Doe", email: "john@example.com") {
    id name email
  }
}

# Get All Clients
query {
  getAllClients {
    id name email
  }
}

# Create Goal
mutation {
  createGoal(clientId: 1, goalName: "Vacation Fund", goalAmount: 5000) {
    id clientId goalName targetAmount
  }
}

# Get All Goals
query {
  getAllGoals {
    id clientId goalName targetAmount
  }
}
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Java Runtime Not Found**
```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
java -version
```

#### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :8080
lsof -i :8081
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### **Frontend Not Loading**
```bash
cd frontend
npm install
npm start
```

#### **Backend Services Not Starting**
```bash
# Check Java processes
ps aux | grep java

# Check service logs
tail -f client-service/client-service.log
tail -f goal-service/goal-service.log
```

#### **Docker Issues**
```bash
# Check Docker status
docker ps
docker-compose ps

# Restart Docker services
./docker-manage.sh restart

# Clean up containers
docker-compose down -v
```

#### **AWS CDK Issues**
```bash
# Check CDK status
cd aws-cdk
npx cdk list

# Destroy and redeploy
npx cdk destroy
npx cdk deploy
```

### **Service Status Check**
```bash
# Check all services
curl http://localhost:3000  # Frontend
curl http://localhost:8080/actuator/health  # Client Service
curl http://localhost:8081/actuator/health  # Goal Service

# Check Docker services
docker-compose ps

# Check Kubernetes services
kubectl get pods -n microservices
```

## 🎉 **Current Status**

### **✅ All Systems Operational**
- **🚀 Frontend**: React app running on port 3000
- **👥 Client Service**: Spring Boot service on port 8080
- **🎯 Goal Service**: Spring Boot service on port 8081
- **🔄 RabbitMQ**: Message broker running
- **💾 Redis**: Cache service running
- **🐘 PostgreSQL**: Database service running
- **🔍 H2 Console**: Database management interface
- **🐳 Docker**: Containerization ready
- **☁️ AWS CDK**: Infrastructure as code ready
- **☸️ Kubernetes**: Deployment manifests ready

### **🧪 Test Data Available**
- Multiple clients created successfully
- Multiple goals created successfully
- Event-driven communication working
- GraphQL APIs responding correctly
- CORS enabled for frontend communication
- Docker containers building and running
- AWS infrastructure deployable

## 🚀 **Next Steps**

### **Immediate Actions**
1. **Test the Frontend**: Create clients and goals through the UI
2. **Verify Dashboard**: Check that data appears correctly
3. **Test GraphQL**: Use GraphiQL to explore APIs
4. **Test Docker**: Build and run containers locally
5. **Deploy to AWS**: Use CDK to deploy cloud infrastructure

### **Future Enhancements**
- Add authentication and authorization
- Implement real-time notifications
- Add data export functionality
- Create mobile-responsive design
- Add unit and integration tests
- Implement CI/CD pipeline
- Add monitoring and alerting
- Implement blue-green deployments

## 📚 **Documentation**

- **📖 Quick Start**: [docs/QUICK_START.md](docs/QUICK_START.md)
- **🏗️ Architecture**: [docs/architecture/](docs/architecture/)
- **📁 Project Structure**: [docs/architecture/PROJECT_STRUCTURE.md](docs/architecture/PROJECT_STRUCTURE.md)
- **🔄 Microservices Flow**: [docs/architecture/MICROSERVICES_FLOW.md](docs/architecture/MICROSERVICES_FLOW.md)
- **☁️ AWS Implementation**: [AWS_IMPLEMENTATION_GUIDE.md](AWS_IMPLEMENTATION_GUIDE.md)
- **🐳 Docker Guide**: [DOCKER_README.md](DOCKER_README.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Your complete microservices application is now running with cloud-native infrastructure, Docker support, and Kubernetes deployment ready!**

**For support or questions, please check the documentation or create an issue in the repository.**
