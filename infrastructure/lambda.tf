terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

variable "ip_stack_key" {
  type = string
}

variable "lambda_version" {
  type = string
}


resource "aws_lambda_function" "lookup_lambda" {
  function_name = "LookupLambda"

  s3_bucket = "terraform-serverless-stage"
  s3_key    = "${var.lambda_version}/lambda-build.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "index.handler"
  runtime = "nodejs12.x"

  role = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      "IP_STACK_KEY" = var.ip_stack_key
    }
  }
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

}
