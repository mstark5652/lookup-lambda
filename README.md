# lambda-lookup
Lookup back-end code to provide extra information on ip address and domain names.
Front-end code can be found in [this repo](https://github.com/mstark5652/lookup-flow).

## Available Scripts
### `npm run build`
Will package code and node_modules into a zip file.
### `npm run deploy`
Will push the zip file from a build to the s3 bucket to stage the files for the lambda function.

## AWS Setup
In `./infrastructure/` there are two documents to configure the lambda function and api gateway in aws.

## Next Steps
* Continuous Deployment of function to S3
