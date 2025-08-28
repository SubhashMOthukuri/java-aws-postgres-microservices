# Multi-stage build for Common Service (Maven Library)
FROM maven:latest AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the common library
RUN mvn clean package -DskipTests

# Runtime stage (minimal)
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/target/*.jar common-service.jar

# Expose port (though common is a library, this is for consistency)
EXPOSE 8082

# Command to run (common service is typically a dependency, not standalone)
CMD ["java", "-jar", "common-service.jar"]
