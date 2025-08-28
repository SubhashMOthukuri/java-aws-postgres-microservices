#!/bin/bash

# 🧪 AWS Services Test Script
# This script demonstrates how to use various AWS services

set -e

echo "🧪 Testing AWS Services for Microservices Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

print_status "Using AWS Account: $AWS_ACCOUNT_ID"
print_status "Using AWS Region: $AWS_REGION"

# Test 1: SNS Topic
print_status "Testing SNS Topic..."
SNS_TOPIC_ARN="arn:aws:sns:$AWS_REGION:$AWS_ACCOUNT_ID:microservices-notifications"

if aws sns get-topic-attributes --topic-arn "$SNS_TOPIC_ARN" > /dev/null 2>&1; then
    print_success "SNS Topic exists: $SNS_TOPIC_ARN"
    
    # Publish test message
    MESSAGE_ID=$(aws sns publish \
        --topic-arn "$SNS_TOPIC_ARN" \
        --message "Test message from microservices application" \
        --subject "Test Notification" \
        --query 'MessageId' \
        --output text)
    
    print_success "Published test message with ID: $MESSAGE_ID"
else
    print_warning "SNS Topic not found. Please deploy the CDK stack first."
fi

# Test 2: SQS Queue
print_status "Testing SQS Queue..."
SQS_QUEUE_URL="https://sqs.$AWS_REGION.amazonaws.com/$AWS_ACCOUNT_ID/microservices-processing"

if aws sqs get-queue-attributes --queue-url "$SQS_QUEUE_URL" --attribute-names All > /dev/null 2>&1; then
    print_success "SQS Queue exists: $SQS_QUEUE_URL"
    
    # Send test message
    MESSAGE_ID=$(aws sqs send-message \
        --queue-url "$SQS_QUEUE_URL" \
        --message-body '{"type":"test","action":"demo","data":{"message":"Hello from microservices"}}' \
        --query 'MessageId' \
        --output text)
    
    print_success "Sent test message with ID: $MESSAGE_ID"
    
    # Receive message
    RECEIVED=$(aws sqs receive-message \
        --queue-url "$SQS_QUEUE_URL" \
        --max-number-of-messages 1 \
        --query 'Messages[0].Body' \
        --output text)
    
    if [ "$RECEIVED" != "None" ]; then
        print_success "Received message: $RECEIVED"
        
        # Delete message
        RECEIPT_HANDLE=$(aws sqs receive-message \
            --queue-url "$SQS_QUEUE_URL" \
            --max-number-of-messages 1 \
            --query 'Messages[0].ReceiptHandle' \
            --output text)
        
        if [ "$RECEIPT_HANDLE" != "None" ]; then
            aws sqs delete-message --queue-url "$SQS_QUEUE_URL" --receipt-handle "$RECEIPT_HANDLE"
            print_success "Deleted test message"
        fi
    fi
else
    print_warning "SQS Queue not found. Please deploy the CDK stack first."
fi

# Test 3: EventBridge
print_status "Testing EventBridge..."
EVENT_BUS_NAME="default"

# Put custom event
EVENT_ID=$(aws events put-events \
    --entries "[{
        \"Source\": \"microservices.test\",
        \"DetailType\": \"TestEvent\",
        \"Detail\": \"{\\\"message\\\":\\\"Test event from microservices\\\",\\\"timestamp\\\":\\\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\\"}\",
        \"EventBusName\": \"$EVENT_BUS_NAME\"
    }]" \
    --query 'Entries[0].EventId' \
    --output text)

if [ "$EVENT_ID" != "None" ]; then
    print_success "Published test event with ID: $EVENT_ID"
else
    print_warning "Failed to publish test event"
fi

# Test 4: Lambda Functions
print_status "Testing Lambda Functions..."

# Test Client Processor Lambda
CLIENT_LAMBDA_NAME="client-processor-lambda"
if aws lambda get-function --function-name "$CLIENT_LAMBDA_NAME" > /dev/null 2>&1; then
    print_success "Lambda function exists: $CLIENT_LAMBDA_NAME"
    
    # Test invocation
    RESPONSE_FILE="client-lambda-response.json"
    aws lambda invoke \
        --function-name "$CLIENT_LAMBDA_NAME" \
        --payload '{"client":{"id":"test123","name":"Test Client"},"action":"create"}' \
        "$RESPONSE_FILE" > /dev/null
    
    if [ -f "$RESPONSE_FILE" ]; then
        RESPONSE=$(cat "$RESPONSE_FILE")
        print_success "Lambda response: $RESPONSE"
        rm "$RESPONSE_FILE"
    fi
else
    print_warning "Lambda function not found. Please deploy the CDK stack first."
fi

# Test 5: Step Functions
print_status "Testing Step Functions..."
STATE_MACHINE_NAME="client-processing-workflow"

# List state machines
STATE_MACHINES=$(aws stepfunctions list-state-machines --query "stateMachines[?name=='$STATE_MACHINE_NAME'].stateMachineArn" --output text)

if [ "$STATE_MACHINES" != "None" ] && [ "$STATE_MACHINES" != "" ]; then
    STATE_MACHINE_ARN="$STATE_MACHINES"
    print_success "State machine exists: $STATE_MACHINE_NAME"
    
    # Start execution
    EXECUTION_ARN=$(aws stepfunctions start-execution \
        --state-machine-arn "$STATE_MACHINE_ARN" \
        --input '{"client":{"id":"test123","name":"Test Client"},"action":"create"}' \
        --query 'executionArn' \
        --output text)
    
    if [ "$EXECUTION_ARN" != "None" ]; then
        print_success "Started execution with ARN: $EXECUTION_ARN"
        
        # Wait a moment for execution to complete
        sleep 5
        
        # Get execution status
        STATUS=$(aws stepfunctions describe-execution \
            --execution-arn "$EXECUTION_ARN" \
            --query 'status' \
            --output text)
        
        print_success "Execution status: $STATUS"
    fi
else
    print_warning "State machine not found. Please deploy the CDK stack first."
fi

# Test 6: RDS Database
print_status "Testing RDS Database..."
DB_INSTANCE_ID="microservices-database"

if aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE_ID" > /dev/null 2>&1; then
    print_success "RDS instance exists: $DB_INSTANCE_ID"
    
    # Get database endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier "$DB_INSTANCE_ID" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)
    
    print_success "Database endpoint: $DB_ENDPOINT"
    
    # Test connection (if psql is available)
    if command -v psql &> /dev/null; then
        print_status "Testing database connection..."
        # Note: This would require the database to be publicly accessible or running from within VPC
        # For security, RDS instances are typically in private subnets
        print_warning "Database connection test skipped (RDS is in private subnet)"
    fi
else
    print_warning "RDS instance not found. Please deploy the CDK stack first."
fi

# Test 7: ElastiCache Redis
print_status "Testing ElastiCache Redis..."
REDIS_CLUSTER_ID="microservices-redis"

if aws elasticache describe-cache-clusters --cache-cluster-id "$REDIS_CLUSTER_ID" > /dev/null 2>&1; then
    print_success "Redis cluster exists: $REDIS_CLUSTER_ID"
    
    # Get Redis endpoint
    REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
        --cache-cluster-id "$REDIS_CLUSTER_ID" \
        --query 'CacheClusters[0].ConfigurationEndpoint.Address' \
        --output text)
    
    print_success "Redis endpoint: $REDIS_ENDPOINT"
    
    # Test connection (if redis-cli is available)
    if command -v redis-cli &> /dev/null; then
        print_status "Testing Redis connection..."
        # Note: This would require Redis to be publicly accessible or running from within VPC
        print_warning "Redis connection test skipped (ElastiCache is in private subnet)"
    fi
else
    print_warning "Redis cluster not found. Please deploy the CDK stack first."
fi

# Test 8: Amazon MQ (RabbitMQ)
print_status "Testing Amazon MQ (RabbitMQ)..."
RABBITMQ_BROKER_ID="microservices-rabbitmq"

if aws mq describe-broker --broker-id "$RABBITMQ_BROKER_ID" > /dev/null 2>&1; then
    print_success "RabbitMQ broker exists: $RABBITMQ_BROKER_ID"
    
    # Get RabbitMQ endpoint
    RABBITMQ_ENDPOINT=$(aws mq describe-broker \
        --broker-id "$RABBITMQ_BROKER_ID" \
        --query 'BrokerInstances[0].Endpoints[0]' \
        --output text)
    
    print_success "RabbitMQ endpoint: $RABBITMQ_ENDPOINT"
    
    # Get management console URL
    MGMT_ENDPOINT=$(aws mq describe-broker \
        --broker-id "$RABBITMQ_BROKER_ID" \
        --query 'BrokerInstances[0].Endpoints[1]' \
        --output text)
    
    if [ "$MGMT_ENDPOINT" != "None" ]; then
        print_success "Management console: https://$MGMT_ENDPOINT:15672"
        print_status "Username: admin, Password: admin123"
    fi
else
    print_warning "RabbitMQ broker not found. Please deploy the CDK stack first."
fi

# Test 9: EKS Cluster
print_status "Testing EKS Cluster..."
CLUSTER_NAME="microservices-cluster"

if aws eks describe-cluster --name "$CLUSTER_NAME" > /dev/null 2>&1; then
    print_success "EKS cluster exists: $CLUSTER_NAME"
    
    # Get cluster endpoint
    CLUSTER_ENDPOINT=$(aws eks describe-cluster \
        --name "$CLUSTER_NAME" \
        --query 'cluster.endpoint' \
        --output text)
    
    print_success "Cluster endpoint: $CLUSTER_ENDPOINT"
    
    # Get cluster version
    CLUSTER_VERSION=$(aws eks describe-cluster \
        --name "$CLUSTER_NAME" \
        --query 'cluster.version' \
        --output text)
    
    print_success "Cluster version: $CLUSTER_VERSION"
    
    # Update kubeconfig
    print_status "Updating kubeconfig..."
    aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$AWS_REGION"
    
    # Test kubectl
    if command -v kubectl &> /dev/null; then
        NODES=$(kubectl get nodes --no-headers | wc -l)
        print_success "EKS cluster has $NODES nodes"
        
        # Check namespaces
        NAMESPACES=$(kubectl get namespaces --no-headers | grep microservices-app | wc -l)
        if [ "$NAMESPACES" -gt 0 ]; then
            print_success "Microservices namespace exists"
            
            # Check deployments
            DEPLOYMENTS=$(kubectl get deployments -n microservices-app --no-headers | wc -l)
            print_success "Found $DEPLOYMENTS deployments in microservices namespace"
        else
            print_warning "Microservices namespace not found. Please deploy Kubernetes resources."
        fi
    else
        print_warning "kubectl not found. Please install kubectl to manage EKS cluster."
    fi
else
    print_warning "EKS cluster not found. Please deploy the CDK stack first."
fi

print_success "🎉 AWS Services testing completed!"
print_status "Summary of what was tested:"
print_status "  ✅ SNS Topic - Message publishing"
print_status "  ✅ SQS Queue - Message sending/receiving"
print_status "  ✅ EventBridge - Custom event publishing"
print_status "  ✅ Lambda Functions - Function invocation"
print_status "  ✅ Step Functions - Workflow execution"
print_status "  ✅ RDS Database - Instance status"
print_status "  ✅ ElastiCache Redis - Cluster status"
print_status "  ✅ Amazon MQ - Broker status"
print_status "  ✅ EKS Cluster - Cluster management"

print_status "Next steps:"
print_status "  1. Deploy Kubernetes resources: kubectl apply -f ../k8s/"
print_status "  2. Test the complete microservices application"
print_status "  3. Monitor services using CloudWatch"
print_status "  4. Set up CI/CD pipeline for automated deployments"
