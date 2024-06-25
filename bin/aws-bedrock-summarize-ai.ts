#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsBedrockSummarizeAiStack } from '../lib/aws-bedrock-summarize-ai-stack';

const app = new cdk.App();
new AwsBedrockSummarizeAiStack(app, 'AwsBedrockSummarizeAiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});