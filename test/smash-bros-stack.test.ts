import { expect } from 'chai'
import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { SmashBrosStack } from '../lib/smash-bros-stack'

describe('SmashBrosStack', () => {
  let template: Template

  before(() => {
    const app = new cdk.App()
    const stack = new SmashBrosStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-west-2' },
      // Skip Next.js build during synthesis
      skipFrontend: true,
    })
    template = Template.fromStack(stack)
  })

  describe('DynamoDB table', () => {
    it('uses on-demand billing', () => {
      template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
        BillingMode: 'PAY_PER_REQUEST',
      })
    })

    it('has correct key schema (pk HASH, id RANGE)', () => {
      template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'id', KeyType: 'RANGE' },
        ],
      })
    })

    it('has RETAIN removal policy', () => {
      template.hasResource('AWS::DynamoDB::GlobalTable', {
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      })
    })
  })

  describe('fighters-sync Lambda', () => {
    it('uses Node.js 24 runtime', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'nodejs24.x',
        Environment: {
          Variables: {
            FIGHTERS_TABLE_NAME: {},
          },
        },
      })
    })

    it('has a weekly EventBridge rule', () => {
      template.hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'cron(0 12 ? * MON *)',
      })
    })
  })

  describe('fighters-backfill Lambda', () => {
    it('has a 5-minute timeout', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 300,
      })
    })

    it('has a CDK Trigger custom resource', () => {
      template.resourceCountIs('Custom::Trigger', 1)
    })
  })
})
