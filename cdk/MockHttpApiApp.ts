import { App } from 'aws-cdk-lib'
import { MockHttpApiStack } from './stacks/MockHttpApiStack.js'

export class MockHttpApiApp extends App {
	public constructor({
		...rest
	}: ConstructorParameters<typeof MockHttpApiStack>[1]) {
		super()

		new MockHttpApiStack(this, rest)
	}
}
