#!/bin/bash

# 🚀 Start All Microservices Script
# This script starts the Client Service and Goal Service

echo "🚀 Starting Java AWS PostgreSQL Microservices..."

# Set Java path
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java 17 not found. Please install OpenJDK 17 first."
    echo "   Run: brew install openjdk@17"
    exit 1
fi

# Check if services are already running
if lsof -i :8080 > /dev/null 2>&1; then
    echo "⚠️  Client Service is already running on port 8080"
else
    echo "🔧 Starting Client Service on port 8080..."
    cd client-service
    nohup java -jar target/client-service-1.0.0.jar > client-service.log 2>&1 &
    CLIENT_PID=$!
    echo "✅ Client Service started with PID: $CLIENT_PID"
    cd ..
fi

if lsof -i :8081 > /dev/null 2>&1; then
    echo "⚠️  Goal Service is already running on port 8081"
else
    echo "🔧 Starting Goal Service on port 8081..."
    cd goal-service
    nohup java -jar target/goal-service-1.0.0.jar > goal-service.log 2>&1 &
    GOAL_PID=$!
    echo "✅ Goal Service started with PID: $GOAL_PID"
    cd ..
fi

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
echo "=================="

if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Client Service: Running on port 8080"
    echo "   - REST API: http://localhost:8080/clients"
    echo "   - GraphQL: http://localhost:8080/graphql"
    echo "   - GraphiQL: http://localhost:8080/graphiql"
    echo "   - Swagger: http://localhost:8080/swagger-ui.html"
else
    echo "❌ Client Service: Not running"
fi

echo ""

if lsof -i :8081 > /dev/null 2>&1; then
    echo "✅ Goal Service: Running on port 8081"
    echo "   - REST API: http://localhost:8081/goals"
    echo "   - GraphQL: http://localhost:8081/graphql"
    echo "   - GraphiQL: http://localhost:8081/graphiql"
    echo "   - Swagger: http://localhost:8081/swagger-ui.html"
else
    echo "❌ Goal Service: Not running"
fi

echo ""
echo "🎉 Services are ready!"
echo "📚 Check the README.md for API documentation and examples"
echo "🛑 To stop services, run: ./scripts/stop-services.sh"
