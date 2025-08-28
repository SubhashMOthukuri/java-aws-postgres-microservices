#!/bin/bash

# 🐳 Docker Management Script for Java AWS PostgreSQL Microservices
# This script provides easy management of Docker containers and services

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all services (production)"
    echo "  start-dev   - Start all services (development mode)"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  status      - Show status of all services"
    echo "  logs        - Show logs for all services"
    echo "  logs-follow - Follow logs for all services"
    echo "  build       - Build all Docker images"
    echo "  clean       - Stop and remove all containers, networks, and volumes"
    echo "  shell       - Open shell in a specific service"
    echo "  health      - Check health of all services"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 start-dev"
    echo "  $0 shell client-service"
    echo "  $0 logs client-service"
}

# Function to start services
start_services() {
    print_header "Starting Production Services"
    check_docker
    
    print_status "Starting infrastructure services..."
    docker-compose up -d postgres redis rabbitmq
    
    print_status "Waiting for infrastructure to be ready..."
    sleep 10
    
    print_status "Starting microservices..."
    docker-compose up -d client-service goal-service
    
    print_status "Waiting for microservices to be ready..."
    sleep 15
    
    print_status "Starting frontend..."
    docker-compose up -d frontend
    
    print_success "All services started successfully!"
    print_status "Services available at:"
    print_status "  - Frontend: http://localhost:3000"
    print_status "  - Client Service: http://localhost:8080"
    print_status "  - Goal Service: http://localhost:8081"
    print_status "  - RabbitMQ Management: http://localhost:15672 (admin/admin123)"
    print_status "  - PostgreSQL: localhost:5432"
}

# Function to start development services
start_dev_services() {
    print_header "Starting Development Services"
    check_docker
    
    print_status "Starting infrastructure services..."
    docker-compose up -d postgres redis rabbitmq
    
    print_status "Waiting for infrastructure to be ready..."
    sleep 10
    
    print_status "Starting microservices in development mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d client-service goal-service
    
    print_status "Waiting for microservices to be ready..."
    sleep 15
    
    print_status "Starting frontend in development mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d frontend
    
    print_success "All development services started successfully!"
    print_status "Services available at:"
    print_status "  - Frontend: http://localhost:3000 (with hot reload)"
    print_status "  - Client Service: http://localhost:8080 (with hot reload)"
    print_status "  - Goal Service: http://localhost:8081 (with hot reload)"
    print_status "  - Debug ports: Client(5005), Goal(5006)"
}

# Function to stop services
stop_services() {
    print_header "Stopping All Services"
    check_docker
    
    print_status "Stopping all services..."
    docker-compose down
    
    print_success "All services stopped successfully!"
}

# Function to restart services
restart_services() {
    print_header "Restarting All Services"
    stop_services
    sleep 5
    start_services
}

# Function to show status
show_status() {
    print_header "Service Status"
    check_docker
    
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Container resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Function to show logs
show_logs() {
    print_header "Service Logs"
    check_docker
    
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs
    else
        print_status "Showing logs for $1..."
        docker-compose logs "$1"
    fi
}

# Function to follow logs
follow_logs() {
    print_header "Following Service Logs"
    check_docker
    
    if [ -z "$1" ]; then
        print_status "Following logs for all services..."
        docker-compose logs -f
    else
        print_status "Following logs for $1..."
        docker-compose logs -f "$1"
    fi
}

# Function to build images
build_images() {
    print_header "Building Docker Images"
    check_docker
    
    print_status "Building all images..."
    ./build-docker.sh
}

# Function to clean everything
clean_all() {
    print_header "Cleaning All Docker Resources"
    check_docker
    
    print_warning "This will remove ALL containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping all services..."
        docker-compose down -v
        
        print_status "Removing all containers..."
        docker container prune -f
        
        print_status "Removing all networks..."
        docker network prune -f
        
        print_status "Removing all volumes..."
        docker volume prune -f
        
        print_status "Removing all images..."
        docker image prune -a -f
        
        print_success "All Docker resources cleaned successfully!"
    else
        print_status "Clean operation cancelled."
    fi
}

# Function to open shell
open_shell() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name"
        print_status "Available services: client-service, goal-service, frontend, postgres, redis, rabbitmq"
        exit 1
    fi
    
    print_header "Opening Shell in $1"
    check_docker
    
    print_status "Opening shell in $1..."
    docker-compose exec "$1" /bin/bash
}

# Function to check health
check_health() {
    print_header "Service Health Check"
    check_docker
    
    services=("client-service:8080" "goal-service:8081" "frontend:3000")
    
    for service in "${services[@]}"; do
        service_name=$(echo "$service" | cut -d: -f1)
        port=$(echo "$service" | cut -d: -f2)
        
        if curl -s "http://localhost:$port/actuator/health" > /dev/null 2>&1; then
            print_success "$service_name is healthy"
        else
            print_error "$service_name is not responding"
        fi
    done
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    start-dev)
        start_dev_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    logs-follow)
        follow_logs "$2"
        ;;
    build)
        build_images
        ;;
    clean)
        clean_all
        ;;
    shell)
        open_shell "$2"
        ;;
    health)
        check_health
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
