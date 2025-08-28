# 🐳 Docker Setup for Java AWS PostgreSQL Microservices

This document provides comprehensive instructions for containerizing and running your microservices application using Docker.

## 📋 **Table of Contents**

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Files Structure](#docker-files-structure)
- [Building Images](#building-images)
- [Running Services](#running-services)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Management Commands](#management-commands)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Client Service │    │  Goal Service   │
│   (Port 3000)   │    │   (Port 8080)   │    │   (Port 8081)   │
│                 │    │                 │    │                 │
│   React +       │    │   Spring Boot   │    │   Spring Boot   │
│   TypeScript    │    │   + JWT +       │    │   + GraphQL     │
│                 │    │   GraphQL       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Common      │
                    │   (Library)     │
                    │                 │
                    │   Shared DTOs   │
                    │   & Utils       │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Infrastructure  │
                    │                 │
                    │ PostgreSQL      │
                    │ Redis           │
                    │ RabbitMQ        │
                    └─────────────────┘
```

## ✅ **Prerequisites**

- **Docker Desktop** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (for cloning the repository)
- **At least 8GB RAM** available for Docker

## 🚀 **Quick Start**

### **1. Clone and Navigate**
```bash
git clone <your-repo-url>
cd java-aws-postgres-microservices
```

### **2. Build All Images**
```bash
./build-docker.sh
```

### **3. Start All Services**
```bash
./docker-manage.sh start
```

### **4. Access Services**
- **Frontend:** http://localhost:3000
- **Client Service:** http://localhost:8080
- **Goal Service:** http://localhost:8081
- **RabbitMQ Management:** http://localhost:15672 (admin/admin123)
- **PostgreSQL:** localhost:5432

## 📁 **Docker Files Structure**

```
├── docker-compose.yml              # Main production compose file
├── docker-compose.dev.yml          # Development override
├── build-docker.sh                 # Build script for all images
├── docker-manage.sh                # Management script
├── common/
│   ├── Dockerfile                  # Common service image
│   └── .dockerignore              # Exclude files from build
├── client-service/
│   ├── Dockerfile                  # Production image
│   ├── Dockerfile.dev              # Development image
│   └── .dockerignore              # Exclude files from build
├── goal-service/
│   ├── Dockerfile                  # Production image
│   ├── Dockerfile.dev              # Development image
│   └── .dockerignore              # Exclude files from build
└── frontend/
    ├── Dockerfile                  # Production image (Nginx)
    ├── Dockerfile.dev              # Development image (Node.js)
    ├── nginx.conf                  # Nginx configuration
    └── .dockerignore              # Exclude files from build
```

## 🔨 **Building Images**

### **Build All Services**
```bash
./build-docker.sh
```

### **Build Individual Services**
```bash
# Common Service
cd common && docker build -t common-service:latest .

# Client Service
cd client-service && docker build -t client-service:latest .

# Goal Service
cd goal-service && docker build -t goal-service:latest .

# Frontend Service
cd frontend && docker build -t frontend-service:latest .
```

### **Build Development Images**
```bash
# Client Service Dev
cd client-service && docker build -f Dockerfile.dev -t client-service:dev .

# Goal Service Dev
cd goal-service && docker build -f Dockerfile.dev -t goal-service:dev .

# Frontend Dev
cd frontend && docker build -f Dockerfile.dev -t frontend-service:dev .
```

## 🚀 **Running Services**

### **Production Mode**
```bash
# Start all services
./docker-manage.sh start

# Or manually
docker-compose up -d
```

### **Development Mode**
```bash
# Start all services in development mode
./docker-manage.sh start-dev

# Or manually
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### **Stop All Services**
```bash
./docker-manage.sh stop

# Or manually
docker-compose down
```

## 🛠️ **Development Mode**

Development mode provides:
- **Hot Reloading** for all services
- **Debug Ports** for Java services (5005, 5006)
- **Volume Mounting** for live code changes
- **Development-specific** environment variables

### **Features**
- **Client Service:** Debug port 5005, hot reload with Spring DevTools
- **Goal Service:** Debug port 5006, hot reload with Spring DevTools
- **Frontend:** Hot reload with React development server
- **Infrastructure:** Persistent data with development volumes

### **Debugging Java Services**
1. Start services in development mode
2. Connect your IDE to debug ports:
   - **Client Service:** localhost:5005
   - **Goal Service:** localhost:5006
3. Set breakpoints and debug in real-time

## 🏭 **Production Mode**

Production mode provides:
- **Optimized Images** with minimal size
- **Security** with non-root users
- **Health Checks** for all services
- **Production-ready** configurations

### **Features**
- **Multi-stage builds** for optimized images
- **Security hardening** with non-root users
- **Health monitoring** with built-in health checks
- **Production environment** variables

## 🎮 **Management Commands**

### **Service Management**
```bash
# Start production services
./docker-manage.sh start

# Start development services
./docker-manage.sh start-dev

# Stop all services
./docker-manage.sh stop

# Restart all services
./docker-manage.sh restart

# Show service status
./docker-manage.sh status

# Check service health
./docker-manage.sh health
```

### **Logs and Debugging**
```bash
# View logs for all services
./docker-manage.sh logs

# View logs for specific service
./docker-manage.sh logs client-service

# Follow logs in real-time
./docker-manage.sh logs-follow

# Follow logs for specific service
./docker-manage.sh logs-follow goal-service
```

### **Container Management**
```bash
# Open shell in service
./docker-manage.sh shell client-service

# Build all images
./docker-manage.sh build

# Clean all Docker resources
./docker-manage.sh clean
```

## 🔧 **Advanced Configuration**

### **Environment Variables**

#### **Client Service**
```yaml
environment:
  SPRING_PROFILES_ACTIVE: docker
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/microservices_db
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: postgres123
  SPRING_REDIS_HOST: redis
  SPRING_REDIS_PORT: 6379
  SPRING_RABBITMQ_HOST: rabbitmq
  SPRING_RABBITMQ_PORT: 5672
  JWT_SECRET: your-super-secret-jwt-key
  JWT_EXPIRATION: 86400000
```

#### **Goal Service**
```yaml
environment:
  SPRING_PROFILES_ACTIVE: docker
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/microservices_db
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: postgres123
  SPRING_REDIS_HOST: redis
  SPRING_REDIS_PORT: 6379
  SPRING_RABBITMQ_HOST: rabbitmq
  SPRING_RABBITMQ_PORT: 5672
```

### **Custom Networks**
```yaml
networks:
  microservices-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### **Volume Mounts**
```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  rabbitmq_data:
    driver: local
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

#### **2. Services Not Starting**
```bash
# Check service logs
./docker-manage.sh logs client-service

# Check service status
./docker-manage.sh status

# Check service health
./docker-manage.sh health
```

#### **3. Database Connection Issues**
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### **4. Memory Issues**
```bash
# Check Docker resource usage
docker stats

# Increase Docker memory limit in Docker Desktop
# Settings → Resources → Memory → Increase to 8GB+
```

### **Debug Commands**
```bash
# Check container status
docker ps -a

# Check container logs
docker logs <container-name>

# Check container resources
docker stats <container-name>

# Execute commands in container
docker exec -it <container-name> /bin/bash

# Check network connectivity
docker network ls
docker network inspect microservices-network
```

## 📊 **Monitoring and Health Checks**

### **Built-in Health Checks**
- **Client Service:** `/actuator/health`
- **Goal Service:** `/actuator/health`
- **Frontend:** `/health`
- **PostgreSQL:** `pg_isready`
- **Redis:** `redis-cli ping`
- **RabbitMQ:** `rabbitmq-diagnostics ping`

### **Health Check Commands**
```bash
# Check all service health
./docker-manage.sh health

# Manual health checks
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:3000/health
```

## 🔒 **Security Considerations**

### **Production Security**
- **Non-root users** in containers
- **Secrets management** for sensitive data
- **Network isolation** with custom networks
- **Health checks** for monitoring
- **Resource limits** to prevent abuse

### **Environment Variables**
- **Never commit** secrets to version control
- **Use .env files** for local development
- **Use Docker secrets** in production
- **Rotate JWT secrets** regularly

## 📈 **Scaling and Performance**

### **Horizontal Scaling**
```bash
# Scale specific services
docker-compose up -d --scale client-service=3
docker-compose up -d --scale goal-service=2
```

### **Resource Limits**
```yaml
services:
  client-service:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### **Load Balancing**
- **Frontend Nginx** can act as a load balancer
- **Multiple instances** of services can be deployed
- **Health checks** ensure only healthy instances receive traffic

## 🚀 **Deployment Options**

### **Local Development**
```bash
./docker-manage.sh start-dev
```

### **Production Deployment**
```bash
./docker-manage.sh start
```

### **Cloud Deployment**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Kubernetes (GKE, EKS, AKS)**

## 📚 **Additional Resources**

### **Docker Commands Reference**
```bash
# Build image
docker build -t service-name:tag .

# Run container
docker run -d -p 8080:8080 service-name:tag

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove image
docker rmi <image-id>

# View logs
docker logs <container-id>

# Execute command
docker exec -it <container-id> /bin/bash
```

### **Docker Compose Commands**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Rebuild and start
docker-compose up -d --build

# Scale services
docker-compose up -d --scale service=3
```

## 🎯 **Best Practices**

1. **Always use multi-stage builds** for production images
2. **Implement health checks** for all services
3. **Use .dockerignore** to exclude unnecessary files
4. **Set resource limits** to prevent resource exhaustion
5. **Use non-root users** in containers
6. **Implement proper logging** and monitoring
7. **Use environment variables** for configuration
8. **Implement proper error handling** and retry logic
9. **Use Docker networks** for service isolation
10. **Regularly update base images** for security patches

## 🆘 **Getting Help**

If you encounter issues:

1. **Check the logs:** `./docker-manage.sh logs`
2. **Verify Docker is running:** `docker info`
3. **Check service health:** `./docker-manage.sh health`
4. **Review this documentation**
5. **Check Docker Desktop resources**
6. **Restart Docker Desktop** if needed

---

**Happy Containerizing! 🐳✨**
