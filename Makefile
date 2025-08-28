# Java AWS Postgres Microservices - Makefile
# Provides clean, consistent commands for common operations

.PHONY: help clean build test start stop deploy-aws deploy-k8s docker-build docker-up docker-down logs

# Default target
help:
	@echo "🚀 Java AWS Postgres Microservices - Available Commands:"
	@echo ""
	@echo "📦 Build Commands:"
	@echo "  build          - Build all services (Maven + Docker)"
	@echo "  build-maven    - Build only Maven projects"
	@echo "  build-docker   - Build Docker images"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  docker-up      - Start all services with Docker Compose"
	@echo "  docker-down    - Stop all Docker services"
	@echo "  docker-logs    - View Docker service logs"
	@echo "  docker-clean   - Clean up Docker containers and images"
	@echo ""
	@echo "☕ Java Commands:"
	@echo "  start-services - Start Java services manually"
	@echo "  stop-services  - Stop Java services"
	@echo ""
	@echo "☁️  AWS Commands:"
	@echo "  deploy-aws     - Deploy to AWS using CDK"
	@echo "  destroy-aws    - Destroy AWS infrastructure"
	@echo ""
	@echo "☸️  Kubernetes Commands:"
	@echo "  deploy-k8s     - Deploy to Kubernetes"
	@echo "  delete-k8s     - Delete Kubernetes resources"
	@echo ""
	@echo "🧹 Utility Commands:"
	@echo "  clean          - Clean all build artifacts"
	@echo "  logs           - View service logs"
	@echo "  status         - Check service status"

# Build commands
build: build-maven build-docker

build-maven:
	@echo "🔨 Building Maven projects..."
	cd common && mvn clean install
	cd ../client-service && mvn clean package
	cd ../goal-service && mvn clean package
	@echo "✅ Maven build completed"

build-docker:
	@echo "🐳 Building Docker images..."
	./infrastructure/docker/build-docker.sh
	@echo "✅ Docker build completed"

# Docker commands
docker-up:
	@echo "🚀 Starting Docker services..."
	docker-compose -f infrastructure/docker/docker-compose.yml up -d
	@echo "✅ Docker services started"

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose -f infrastructure/docker/docker-compose.yml down
	@echo "✅ Docker services stopped"

docker-logs:
	@echo "📋 Docker service logs..."
	docker-compose -f infrastructure/docker/docker-compose.yml logs -f

docker-clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose -f infrastructure/docker/docker-compose.yml down -v
	docker system prune -f
	@echo "✅ Docker cleanup completed"

# Java service commands
start-services:
	@echo "☕ Starting Java services..."
	./deployment/scripts/start-services.sh

stop-services:
	@echo "🛑 Stopping Java services..."
	pkill -f "java.*client-service" || true
	pkill -f "java.*goal-service" || true
	@echo "✅ Java services stopped"

# AWS deployment
deploy-aws:
	@echo "☁️  Deploying to AWS..."
	cd infrastructure/aws && ./deploy.sh

destroy-aws:
	@echo "🗑️  Destroying AWS infrastructure..."
	cd infrastructure/aws && npx cdk destroy

# Kubernetes deployment
deploy-k8s:
	@echo "☸️  Deploying to Kubernetes..."
	kubectl apply -f infrastructure/kubernetes/namespace.yaml
	kubectl apply -f infrastructure/kubernetes/
	@echo "✅ Kubernetes deployment completed"

delete-k8s:
	@echo "🗑️  Deleting Kubernetes resources..."
	kubectl delete -f infrastructure/kubernetes/ --ignore-not-found=true
	kubectl delete namespace microservices --ignore-not-found=true
	@echo "✅ Kubernetes cleanup completed"

# Utility commands
clean:
	@echo "🧹 Cleaning build artifacts..."
	cd common && mvn clean
	cd ../client-service && mvn clean
	cd ../goal-service && mvn clean
	cd ../frontend && rm -rf node_modules package-lock.json
	@echo "✅ Cleanup completed"

logs:
	@echo "📋 Service logs..."
	@echo "Client Service:"
	tail -f logs/client-service.log &
	@echo "Goal Service:"
	tail -f logs/goal-service.log &
	@echo "Frontend:"
	tail -f logs/frontend.log &

status:
	@echo "📊 Service Status:"
	@echo "Docker Services:"
	docker-compose -f infrastructure/docker/docker-compose.yml ps
	@echo ""
	@echo "Java Processes:"
	ps aux | grep java | grep -v grep || echo "No Java processes running"
	@echo ""
	@echo "Port Usage:"
	@echo "Port 3000 (Frontend): $(shell lsof -i :3000 2>/dev/null | wc -l || echo 0) processes"
	@echo "Port 8080 (Client): $(shell lsof -i :8080 2>/dev/null | wc -l || echo 0) processes"
	@echo "Port 8081 (Goal): $(shell lsof -i :8081 2>/dev/null | wc -l || echo 0) processes"

# Development commands
dev-setup:
	@echo "🔧 Setting up development environment..."
	cd frontend && npm install
	@echo "✅ Development setup completed"

dev-start:
	@echo "🚀 Starting development environment..."
	@make docker-up
	@make start-services
	cd frontend && npm start

# Production commands
prod-build:
	@echo "🏭 Building production artifacts..."
	@make build
	@make build-docker

prod-deploy:
	@echo "🚀 Deploying to production..."
	@make deploy-aws
	@make deploy-k8s
