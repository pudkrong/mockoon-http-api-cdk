# Deploying Mockoon on AWS Lambda using CDK and TypeScript

This project aims to deploy a Mockoon instance on AWS Lambda using the AWS Cloud
Development Kit (CDK) and TypeScript. This allows you to simulate and test your
API endpoints using Mockoon's capabilities in a serverless environment.

## Prerequisites

Before deploying this project, make sure you have the following prerequisites:

1.  Node.js and npm installed on your machine.
2.  AWS CLI configured with necessary credentials.
3.  AWS CDK CLI installed (`npm install -g aws-cdk`).
4.  A Mockoon definition file (`.json`) that describes your API endpoints.

## Deployment Steps

Follow these steps to deploy Mockoon on AWS Lambda:

1.  Clone this repository to your local machine:

    ```sh
    git clone https://github.com/pudkrong/mockoon-http-api-cdk.git
    cd mockoon-http-api-cdk
    ```

2.  Install the project dependencies:

    ```sh
    npm install
    ```

3.  Deploy the project using CDK:

    ```sh
    npx cdk deploy
    ```

    This command will provision the necessary AWS resources, including the
    Lambda function.

4.  After the deployment is successful, you will receive the URL of your Lambda
    function. This URL will serve as your mock API endpoint.
5.  Upload your Mockoon definition file to an S3 bucket. Replace `<bucket>` with
    the name of your S3 bucket and `/path/to/definition` with the local path to
    your Mockoon definition file.

    ```sh
    aws s3 cp /path/to/definition s3://<bucket>/mock.json
    ```

## Testing the Mock API

With the deployment completed and the Mockoon definition uploaded to the S3
bucket, you can now test your mock API:

1.  Access the URL of your Lambda function obtained during deployment.
2.  Send HTTP requests to the API endpoints defined in your Mockoon definition.
3.  The Lambda function will respond with mock data as per your definition.

## Cleaning Up

To avoid incurring unnecessary charges, make sure to delete the AWS resources
when you're done testing:

1.  Remove the deployed resources using CDK:

    ```sh
    aws s3 rm s3://<bucket> --recursive
    npx cdk destroy
    ```

2.  Confirm the deletion when prompted.

## Conclusion

This project enables you to deploy Mockoon on AWS Lambda, allowing you to
simulate and test your API endpoints in a serverless environment. The CDK and
TypeScript setup streamlines the deployment process, and integrating with S3 for
Mockoon definition storage enhances flexibility. Happy mocking!
