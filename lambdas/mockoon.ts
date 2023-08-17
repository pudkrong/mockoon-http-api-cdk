import { MockoonServerless } from '@mockoon/serverless'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromEnv } from '@nordicsemiconductor/from-env'

const { Bucket, Key } = fromEnv({ Bucket: 'BUCKET', Key: 'DEFINITION' })(
	process.env,
)

const s3 = new S3Client({})
const s3Object = await s3.send(
	new GetObjectCommand({
		Key,
		Bucket,
	}),
)
const data = await s3Object?.Body?.transformToString()
if (data === undefined) throw new Error(`Cannot read ${Key} from ${Bucket}`)

const definition = JSON.parse(data)
const mockoonServerless = new MockoonServerless(definition, {
	logTransaction: true,
})

export const handler = mockoonServerless.awsHandler()
