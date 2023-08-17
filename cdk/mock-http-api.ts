import { MockHttpApiApp } from './MockHttpApiApp.js'
import { env } from './helpers/env.js'
import type { PackedLambda } from './helpers/lambdas/packLambda.js'
import { packLambdaFromPath } from './helpers/lambdas/packLambdaFromPath.js'
import { packLayer } from './helpers/lambdas/packLayer.js'
import { STS } from '@aws-sdk/client-sts'

export type PackMockApiLambdas = {
	mockoon: PackedLambda
}

const sts = new STS({})

const packagesInLayer: string[] = [
	'@mockoon/serverless',
	'@nordicsemiconductor/from-env',
]
const accountEnv = await env({ sts })

new MockHttpApiApp({
	lambdaSources: {
		mockoon: await packLambdaFromPath('mockoon', 'lambdas/mockoon.ts'),
	},
	layer: await packLayer({
		id: 'baseLayer',
		dependencies: packagesInLayer,
	}),
	env: accountEnv,
})
