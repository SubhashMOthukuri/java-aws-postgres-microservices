# Multi-stage build for Goal Service
FROM maven:latest AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Copy the common JAR and install it to local Maven repo
COPY common-1.0.0.jar /root/.m2/repository/com/Java_AWS_Project/common/1.0.0/

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy the built JAR
COPY --from=builder /app/target/*.jar goal-service.jar

# Change ownership to non-root user
RUN chown spring:spring goal-service.jar

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8081/actuator/health || exit 1

# Command to run
CMD ["java", "-jar", "goal-service.jar"]
