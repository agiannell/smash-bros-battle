#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { SmashBrosStack } from '../lib/smash-bros-stack'

const app = new cdk.App()
new SmashBrosStack(app, 'SmashBrosStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2',
  },
})
