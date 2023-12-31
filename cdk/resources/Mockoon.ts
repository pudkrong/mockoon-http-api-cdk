import { Construct } from 'constructs'
import type { PackedLambda } from '../helpers/lambdas/packLambda'
import {
	Duration,
	aws_lambda as Lambda,
	RemovalPolicy,
	aws_s3 as S3,
	aws_iam as IAM,
	aws_lambda_event_sources as EventSources,
} from 'aws-cdk-lib'
import { LambdaSource } from './LambdaSource.js'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { FunctionUrl, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'

export class Mockoon extends Construct {
	public readonly bucket: S3.Bucket
	public readonly mockUrl: FunctionUrl
	public constructor(
		parent: Construct,
		{
			lambdaSources,
			layers,
			definition,
		}: {
			lambdaSources: {
				mockoon: PackedLambda
				reloadLambda: PackedLambda
			}
			layers: Lambda.ILayerVersion[]
			definition: string
		},
	) {
		super(parent, 'Mockoon')

		this.bucket = new S3.Bucket(this, 'bucket', {
			removalPolicy: RemovalPolicy.DESTROY,
		})

		const mockoon = new Lambda.Function(this, 'mockoon', {
			handler: lambdaSources.mockoon.handler,
			architecture: Lambda.Architecture.ARM_64,
			runtime: Lambda.Runtime.NODEJS_18_X,
			timeout: Duration.seconds(10),
			memorySize: 1792,
			code: new LambdaSource(this, lambdaSources.mockoon).code,
			description: 'Mockoon Mock API',
			environment: {
				VERSION: this.node.tryGetContext('version'),
				BUCKET: this.bucket.bucketName,
				DEFINITION: definition,
			},
			layers,
			logRetention: RetentionDays.ONE_DAY,
		})
		this.mockUrl = mockoon.addFunctionUrl({
			authType: FunctionUrlAuthType.NONE,
		})
		this.bucket.grantRead(mockoon)

		const reloadLambda = new Lambda.Function(this, 'reloadLambda', {
			handler: lambdaSources.reloadLambda.handler,
			architecture: Lambda.Architecture.ARM_64,
			runtime: Lambda.Runtime.NODEJS_18_X,
			timeout: Duration.seconds(5),
			memorySize: 1792,
			code: new LambdaSource(this, lambdaSources.reloadLambda).code,
			description: 'Reload lambda function',
			environment: {
				VERSION: this.node.tryGetContext('version'),
				FUNCTION_NAME: mockoon.functionName,
			},
			initialPolicy: [
				new IAM.PolicyStatement({
					actions: [
						'lambda:GetFunctionConfiguration',
						'lambda:UpdateFunctionConfiguration',
					],
					resources: [mockoon.functionArn],
				}),
			],
			layers,
			logRetention: RetentionDays.ONE_DAY,
		})
		reloadLambda.addEventSource(
			new EventSources.S3EventSource(this.bucket, {
				events: [
					S3.EventType.OBJECT_CREATED_POST,
					S3.EventType.OBJECT_CREATED_PUT,
					S3.EventType.OBJECT_CREATED_COPY,
				],
			}),
		)
	}
}
