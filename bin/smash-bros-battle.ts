#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { SmashBrosBattleStack } from '../lib/smash-bros-battle-stack'

const app = new cdk.App()
const stack = new SmashBrosBattleStack(app, 'SmashBrosBattleStack')
cdk.Tags.of(stack).add('App', 'SmashBrosBattle')
cdk.Tags.of(stack).add('Environment', process.env.NODE_ENV!)
