# 🏗️ Project Structure & Organization

This document describes the clean, organized structure of the Java AWS Postgres Microservices project.

## 📁 **Root Directory Structure**

```
Java_Aws_Postgres/
├── 📁 services/                    # Microservices applications
│   ├── 📁 client-service/         # Client management service
│   ├── 📁 goal-service/           # Goal management service
│   ├── 📁 common/                 # Shared components and DTOs
│   └── 📁 frontend/               # React frontend application
├── 📁 infrastructure/              # Infrastructure and deployment
│   ├── 📁 aws/                    # AWS CDK infrastructure code
│   ├── 📁 docker/                 # Docker configurations
│   └── 📁 kubernetes/             # Kubernetes manifests
├── 📁 deployment/                  # Deployment scripts and configs
│   ├── 📁 scripts/                # Utility scripts
│   └── 📁 configs/                # Configuration files
├── 📁 documentation/               # Project documentation
│   ├── 📁 guides/                 # Implementation guides
│   ├── 📁 api/                    # API documentation
│   └── 📁 architecture/           # Architecture documentation
├── 📁 logs/                       # Application logs
├── 📄 Makefile                    # Project automation commands
├── 📄 project.config.json         # Project configuration
├── 📄 README.md                   # Main project documentation
└── 📄 .gitignore                  # Git ignore rules
```

## 🎯 **Directory Purposes**

### **📁 services/**
Contains all the microservices and frontend applications:

- **client-service/**: Spring Boot service for client management
- **goal-service/**: Spring Boot service for goal management  
- **common/**: Shared Java components and DTOs
- **frontend/**: React TypeScript frontend application

### **📁 infrastructure/**
Contains all infrastructure and deployment configurations:

- **aws/**: AWS CDK stack definitions and deployment scripts
- **docker/**: Docker Compose files and container configurations
- **kubernetes/**: Kubernetes deployment manifests and configurations

### **📁 deployment/**
Contains deployment-related scripts and configurations:

- **scripts/**: Utility scripts for building, starting, and managing services
- **configs/**: Configuration files for different environments

### **📁 documentation/**
Contains comprehensive project documentation:

- **guides/**: Implementation guides (AWS, Docker, JWT)
- **api/**: API documentation and specifications
- **architecture/**: System architecture and design documents

### **📁 logs/**
Centralized location for all application logs.

## 🚀 **Key Files**

### **📄 Makefile**
Provides consistent commands for common operations:
- `make help` - Show available commands
- `make build` - Build all services
- `make docker-up` - Start Docker services
- `make deploy-aws` - Deploy to AWS
- `make deploy-k8s` - Deploy to Kubernetes

### **📄 project.config.json**
Defines project configuration and structure metadata.

### **📄 README.md**
Main project documentation with setup and usage instructions.

## 🔧 **Service Organization**

Each service follows a consistent structure:

```
service-name/
├── 📁 src/
│   ├── 📁 main/
│   │   ├── 📁 java/              # Java source code
│   │   └── 📁 resources/         # Configuration files
│   └── 📁 test/                  # Test code
├── 📄 Dockerfile                  # Production container
├── 📄 Dockerfile.dev             # Development container
├── 📄 pom.xml                    # Maven configuration
└── 📄 README.md                  # Service-specific documentation
```

## 🐳 **Docker Organization**

Docker-related files are organized in `infrastructure/docker/`:

```
infrastructure/docker/
├── 📄 docker-compose.yml         # Production Docker setup
├── 📄 docker-compose.dev.yml     # Development Docker setup
├── 📄 build-docker.sh            # Docker build script
└── 📄 docker-manage.sh           # Docker management script
```

## ☁️ **AWS Infrastructure**

AWS CDK code is organized in `infrastructure/aws/`:

```
infrastructure/aws/
├── 📁 bin/                       # CDK app entry point
├── 📁 lib/                       # CDK stack definitions
├── 📄 package.json               # Node.js dependencies
├── 📄 deploy.sh                  # Deployment script
└── 📄 test-aws-services.sh       # AWS service testing
```

## ☸️ **Kubernetes Organization**

Kubernetes manifests are organized in `infrastructure/kubernetes/`:

```
infrastructure/kubernetes/
├── 📄 namespace.yaml             # Kubernetes namespace
├── 📄 postgres-deployment.yaml   # PostgreSQL deployment
├── 📄 client-service-deployment.yaml # Client service deployment
├── 📄 configmap.yaml             # Configuration
└── 📄 secrets.yaml               # Secrets management
```

## 📚 **Documentation Organization**

Documentation is organized by type in `documentation/`:

```
documentation/
├── 📁 guides/                    # Implementation guides
│   ├── 📄 AWS_IMPLEMENTATION_GUIDE.md
│   ├── 📄 DOCKER_README.md
│   └── 📄 JWT_IMPLEMENTATION_GUIDE.md
├── 📁 api/                       # API documentation
│   └── 📄 (API specs and docs)
└── 📁 architecture/              # Architecture documentation
    ├── 📄 MICROSERVICES_FLOW.md
    └── 📄 PROJECT_STRUCTURE.md
```

## 🎯 **Benefits of This Structure**

### **✅ Clean Separation of Concerns**
- Services are separate from infrastructure
- Documentation is organized by type
- Deployment scripts are centralized

### **✅ Easy Navigation**
- Logical grouping of related files
- Consistent naming conventions
- Clear purpose for each directory

### **✅ Scalability**
- Easy to add new services
- Infrastructure can be extended independently
- Documentation grows organically

### **✅ Team Collaboration**
- Developers focus on services
- DevOps focuses on infrastructure
- Clear ownership of different areas

### **✅ Deployment Flexibility**
- Multiple deployment options (Docker, K8s, AWS)
- Environment-specific configurations
- Centralized deployment scripts

## 🚀 **Getting Started**

1. **Explore the structure**: Use `make help` to see available commands
2. **Start development**: Use `make dev-start` for local development
3. **Build services**: Use `make build` to build all services
4. **Deploy**: Use `make deploy-aws` or `make deploy-k8s`

## 🔄 **Maintenance**

- Keep services in the `services/` directory
- Add new infrastructure in `infrastructure/`
- Update documentation in `documentation/`
- Use the Makefile for common operations
- Follow the established naming conventions

This structure provides a clean, professional foundation for your microservices project that's easy to understand, maintain, and extend! 🎉
