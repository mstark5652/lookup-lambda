# lambda-lookup

## Build lambda package
`zip -r ./lambda-build.zip index.js node_modules/**/*`

## Upload package to s3
`aws s3 cp lambda-build.zip s3://terraform-serverless-stage/v0.2.0/lambda-build.zip`
