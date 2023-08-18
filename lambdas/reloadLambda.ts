import { fromEnv } from '@nordicsemiconductor/from-env'
import type { S3Handler } from 'aws-lambda'
import {
	GetFunctionConfigurationCommand,
	LambdaClient,
	UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda'

const { FunctionName } = fromEnv({ FunctionName: 'FUNCTION_NAME' })(process.env)

const lambda = new LambdaClient({})

export const handler = async (event: S3Handler) => {
	console.log('event', event)

	const { Environment } = await lambda.send(
		new GetFunctionConfigurationCommand({
			FunctionName,
		}),
	)

	const newEnv = { ...Environment?.Variables, reloadTs: Date.now().toString() }

	await lambda.send(
		new UpdateFunctionConfigurationCommand({
			FunctionName,
			Environment: {
				Variables: newEnv,
			},
		}),
	)
}
