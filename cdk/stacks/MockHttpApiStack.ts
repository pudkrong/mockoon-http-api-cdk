import {
	App,
	aws_lambda as Lambda,
	Stack,
	type Environment,
	CfnOutput,
} from 'aws-cdk-lib'
import { STACK_NAME, DEFINITION_NAME } from './stackConfig.js'
import type { PackMockApiLambdas } from '../mock-http-api.js'
import type { PackedLayer } from '../helpers/lambdas/packLayer.js'
import { LambdaSource } from '../resources/LambdaSource.js'
import { Mockoon } from '../resources/Mockoon.js'

export class MockHttpApiStack extends Stack {
	public constructor(
		parent: App,
		{
			lambdaSources,
			layer,
			env,
		}: {
			lambdaSources: PackMockApiLambdas
			layer: PackedLayer
			env: Required<Environment>
		},
	) {
		super(parent, STACK_NAME, {
			env,
		})

		const baseLayer = new Lambda.LayerVersion(this, 'baseLayer', {
			code: new LambdaSource(this, {
				id: 'baseLayer',
				zipFile: layer.layerZipFile,
				hash: layer.hash,
			}).code,
			compatibleArchitectures: [Lambda.Architecture.ARM_64],
			compatibleRuntimes: [Lambda.Runtime.NODEJS_18_X],
		})

		const lambdaLayers: Lambda.ILayerVersion[] = [baseLayer]

		const mockoon = new Mockoon(this, {
			lambdaSources,
			layers: lambdaLayers,
			definition: DEFINITION_NAME,
		})

		// Outputs
		new CfnOutput(this, 'mockHttpDefinition', {
			exportName: `${this.stackName}:mockHttpDefinition`,
			description: 'Mock http definition',
			value: `${mockoon.bucket.bucketName}/${DEFINITION_NAME}`,
		})
		new CfnOutput(this, 'mockEndpoint', {
			exportName: `${this.stackName}:mockEndpoint`,
			description: 'Mock Http API endpoint',
			value: mockoon.mockUrl.url,
		})
	}
}

export type StackOutputs = {
	mockHttpDefinition: string
	mockEndpoint: string
}
