import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as mq from 'aws-cdk-lib/aws-mq';
import { Construct } from 'constructs';

export class MicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the microservices
    const vpc = new ec2.Vpc(this, 'MicroservicesVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // EKS Cluster
    const cluster = new eks.Cluster(this, 'MicroservicesCluster', {
      vpc,
      version: eks.KubernetesVersion.V1_28,
      clusterName: 'microservices-cluster',
      defaultCapacity: 2,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
    });

    // RDS PostgreSQL Database
    const database = new rds.DatabaseInstance(this, 'MicroservicesDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      databaseName: 'microservices_db',
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
    });

    // ElastiCache Redis
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis',
      subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }).subnetIds,
    });

    const redis = new elasticache.CfnCacheCluster(this, 'RedisCache', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    });

    // Amazon MQ (RabbitMQ)
    const rabbitmq = new mq.CfnBroker(this, 'RabbitMQBroker', {
      brokerName: 'microservices-rabbitmq',
      engineType: 'RabbitMQ',
      engineVersion: '3.10.20',
      hostInstanceType: 'mq.t3.micro',
      deploymentMode: 'SINGLE_INSTANCE',
      publiclyAccessible: false,
      subnetIds: [vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }).subnetIds[0]],
      users: [
        {
          username: 'admin',
          password: 'admin123',
          consoleAccess: true,
          groups: ['admin'],
        },
      ],
    });

    // SNS Topic for notifications
    const notificationTopic = new sns.Topic(this, 'NotificationTopic', {
      topicName: 'microservices-notifications',
      displayName: 'Microservices Notifications',
    });

    // SQS Queue for dead letter
    const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      queueName: 'microservices-dlq',
      retentionPeriod: cdk.Duration.days(14),
    });

    // SQS Queue for processing
    const processingQueue = new sqs.Queue(this, 'ProcessingQueue', {
      queueName: 'microservices-processing',
      visibilityTimeout: cdk.Duration.seconds(300),
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3,
      },
    });

    // Lambda Functions
    const clientProcessorLambda = new lambda.Function(this, 'ClientProcessorLambda', {
      runtime: lambda.Runtime.JAVA_17,
      handler: 'com.Java_AWS_Project.lambda.ClientProcessor::handleRequest',
      code: lambda.Code.fromAsset('../client-service/target/client-service.jar'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        DATABASE_SECRET_ARN: database.secret?.secretArn || '',
        REDIS_ENDPOINT: redis.attrRedisEndpointAddress,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    const goalProcessorLambda = new lambda.Function(this, 'GoalProcessorLambda', {
      runtime: lambda.Runtime.JAVA_17,
      handler: 'com.Java_AWS_Project.lambda.GoalProcessor::handleRequest',
      code: lambda.Code.fromAsset('../goal-service/target/goal-service.jar'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        DATABASE_SECRET_ARN: database.secret?.secretArn || '',
        REDIS_ENDPOINT: redis.attrRedisEndpointAddress,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });

    // Step Functions State Machine
    const clientWorkflow = new sfn.StateMachine(this, 'ClientWorkflow', {
      definition: new sfn.Chain
        .start(new tasks.LambdaInvoke(this, 'ProcessClient', {
          lambdaFunction: clientProcessorLambda,
          payload: sfn.TaskInput.fromObject({
            'client.$': '$.client',
            'action.$': '$.action',
          }),
        }))
        .next(new tasks.SnsPublish(this, 'NotifyClientProcessed', {
          topic: notificationTopic,
          message: sfn.TaskInput.fromObject({
            'message': 'Client processed successfully',
            'clientId.$': '$.Payload.clientId',
            'timestamp.$': '$$.State.EnteredTime',
          }),
        }))
        .next(new sfn.Succeed(this, 'ClientWorkflowComplete')),
      stateMachineName: 'client-processing-workflow',
    });

    const goalWorkflow = new sfn.StateMachine(this, 'GoalWorkflow', {
      definition: new sfn.Chain
        .start(new tasks.LambdaInvoke(this, 'ProcessGoal', {
          lambdaFunction: goalProcessorLambda,
          payload: sfn.TaskInput.fromObject({
            'goal.$': '$.goal',
            'action.$': '$.action',
          }),
        }))
        .next(new tasks.SnsPublish(this, 'NotifyGoalProcessed', {
          topic: notificationTopic,
          message: sfn.TaskInput.fromObject({
            'message': 'Goal processed successfully',
            'goalId.$': '$.Payload.goalId',
            'timestamp.$': '$$.State.EnteredTime',
          }),
        }))
        .next(new sfn.Succeed(this, 'GoalWorkflowComplete')),
      stateMachineName: 'goal-processing-workflow',
    });

    // EventBridge Rules
    const clientEventRule = new events.Rule(this, 'ClientEventRule', {
      eventPattern: {
        source: ['microservices.client'],
        detailType: ['ClientCreated', 'ClientUpdated', 'ClientDeleted'],
      },
      targets: [
        new targets.SfnStateMachine(clientWorkflow),
        new targets.Sqs(processingQueue),
      ],
    });

    const goalEventRule = new events.Rule(this, 'GoalEventRule', {
      eventPattern: {
        source: ['microservices.goal'],
        detailType: ['GoalCreated', 'GoalUpdated', 'GoalDeleted'],
      },
      targets: [
        new targets.SfnStateMachine(goalWorkflow),
        new targets.Sqs(processingQueue),
      ],
    });

    // IAM Roles and Policies
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
      ],
    });

    // Grant permissions
    database.secret?.grantRead(clientProcessorLambda);
    database.secret?.grantRead(goalProcessorLambda);
    notificationTopic.grantPublish(clientProcessorLambda);
    notificationTopic.grantPublish(goalProcessorLambda);
    processingQueue.grantSendMessages(clientProcessorLambda);
    processingQueue.grantSendMessages(goalProcessorLambda);

    // CloudWatch Log Groups
    new logs.LogGroup(this, 'ClientProcessorLogs', {
      logGroupName: '/aws/lambda/client-processor',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    new logs.LogGroup(this, 'GoalProcessorLogs', {
      logGroupName: '/aws/lambda/goal-processor',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName,
      description: 'EKS Cluster Name',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
      description: 'RDS Database Endpoint',
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redis.attrRedisEndpointAddress,
      description: 'Redis Endpoint',
    });

    new cdk.CfnOutput(this, 'RabbitMQEndpoint', {
      value: rabbitmq.attrAmqpEndpoints[0],
      description: 'RabbitMQ AMQP Endpoint',
    });

    new cdk.CfnOutput(this, 'NotificationTopicArn', {
      value: notificationTopic.topicArn,
      description: 'SNS Notification Topic ARN',
    });
  }
}
