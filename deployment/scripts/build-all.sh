#!/bin/bash

# 🔨 Build All Modules Script
# This script builds the common, client-service, and goal-service modules

echo "🔨 Building Java AWS PostgreSQL Microservices..."

# Set Java path
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java 17 not found. Please install OpenJDK 17 first."
    echo "   Run: brew install openjdk@17"
    exit 1
fi

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven first."
    echo "   Run: brew install maven"
    exit 1
fi

echo "📦 Building Common Module..."
cd common
if mvn clean install -DskipTests; then
    echo "✅ Common module built successfully"
else
    echo "❌ Failed to build common module"
    exit 1
fi
cd ..

echo ""
echo "📦 Building Client Service..."
cd client-service
if mvn clean package -DskipTests; then
    echo "✅ Client service built successfully"
else
    echo "❌ Failed to build client service"
    exit 1
fi
cd ..

echo ""
echo "📦 Building Goal Service..."
cd goal-service
if mvn clean package -DskipTests; then
    echo "✅ Goal service built successfully"
else
    echo "❌ Failed to build goal service"
    exit 1
fi
cd ..

echo ""
echo "🎉 All modules built successfully!"
echo ""
echo "📁 Generated JAR files:"
echo "   - client-service/target/client-service-1.0.0.jar"
echo "   - goal-service/target/goal-service-1.0.0.jar"
echo ""
echo "🚀 To start services, run: ./scripts/start-services.sh"
echo "🧪 To run tests, run: ./scripts/test-all.sh"
