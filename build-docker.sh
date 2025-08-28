#!/bin/bash

# 🐳 Docker Build Script for Java AWS PostgreSQL Microservices
# This script builds all Docker images for the microservices

set -e  # Exit on any error

echo "🚀 Starting Docker build process for all microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build Common Service (Library) and install to local Maven repo
print_status "Building Common Service..."
cd common
mvn clean install -DskipTests
print_success "Common Service built and installed to local Maven repo"

# Copy the built JAR to client-service and goal-service for Docker builds
print_status "Copying Common Service JAR to dependent services..."
cp target/common-1.0.0.jar ../client-service/
cp target/common-1.0.0.jar ../goal-service/
print_success "Common Service JAR copied to dependent services"
cd ..

# Build Client Service
print_status "Building Client Service..."
cd client-service
docker build -t client-service:latest .
print_success "Client Service built successfully"
cd ..

# Build Goal Service
print_status "Building Goal Service..."
cd goal-service
docker build -t goal-service:latest .
print_success "Goal Service built successfully"
cd ..

# Build Frontend Service
print_status "Building Frontend Service..."
cd frontend
docker build -t frontend-service:latest .
print_success "Frontend Service built successfully"
cd ..

# Build Development Images
print_status "Building Development Images..."

# Client Service Dev
cd client-service
docker build -f Dockerfile.dev -t client-service:dev .
print_success "Client Service Dev built successfully"
cd ..

# Goal Service Dev
cd goal-service
docker build -f Dockerfile.dev -t goal-service:dev .
print_success "Goal Service Dev built successfully"
cd ..

# Frontend Dev
cd frontend
docker build -f Dockerfile.dev -t frontend-service:dev .
print_success "Frontend Service Dev built successfully"
cd ..

# Clean up copied JARs
print_status "Cleaning up temporary files..."
rm -f client-service/common-1.0.0.jar
rm -f goal-service/common-1.0.0.jar
print_success "Temporary files cleaned up"

# List all built images
print_status "Listing all built images:"
docker images | grep -E "(common-service|client-service|goal-service|frontend-service)"

print_success "🎉 All Docker images built successfully!"
print_status "You can now run: docker-compose up -d"
print_status "Or for development: docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d"
