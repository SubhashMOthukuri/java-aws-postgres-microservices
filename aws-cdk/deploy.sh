#!/bin/bash

# 🚀 AWS CDK Deployment Script for Microservices Infrastructure
# This script deploys the complete AWS infrastructure

set -e  # Exit on any error

echo "🚀 Starting AWS CDK deployment for microservices infrastructure..."

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

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    print_error "AWS CDK is not installed. Please install it first: npm install -g aws-cdk"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the aws-cdk directory"
    exit 1
fi

# Install dependencies
print_status "Installing CDK dependencies..."
npm install

# Build the TypeScript code
print_status "Building TypeScript code..."
npm run build

# Bootstrap CDK (only needed once per account/region)
print_status "Bootstrapping CDK (if needed)..."
cdk bootstrap

# Deploy the infrastructure
print_status "Deploying microservices infrastructure..."
cdk deploy --require-approval never

print_success "🎉 AWS CDK deployment completed successfully!"
print_status "Your microservices infrastructure is now running on AWS!"
print_status "Check the outputs above for important information like:"
print_status "  - EKS Cluster Name"
print_status "  - Database Endpoint"
print_status "  - Redis Endpoint"
print_status "  - RabbitMQ Endpoint"
print_status "  - SNS Topic ARN"

# Show the outputs
print_status "Fetching stack outputs..."
aws cloudformation describe-stacks \
    --stack-name MicroservicesStack \
    --query 'Stacks[0].Outputs' \
    --output table
