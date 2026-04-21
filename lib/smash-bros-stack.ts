import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as triggers from 'aws-cdk-lib/triggers'
import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { Nextjs } from 'cdk-nextjs-standalone'
// DnsValidatedCertificate is deprecated in CDK v2 but is the only way to
// provision an ACM certificate in a different region (us-east-1 for CloudFront)
// without bootstrapping that region for CDK. The `region` prop creates the
// certificate via a Lambda custom resource at deploy time.
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager'

export interface SmashBrosStackProps extends cdk.StackProps {
  /**
   * Skip the Next.js frontend construct. Set to true in tests to avoid
   * triggering a full Next.js build during CDK synthesis.
   * @default false
   */
  skipFrontend?: boolean
}

export class SmashBrosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: SmashBrosStackProps) {
    super(scope, id, props)

    const fightersTable = new dynamodb.TableV2(this, 'SmashFightersTable', {
      tableName: 'smash-bros-fighters',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const fightersSyncFn = new lambdaNodejs.NodejsFunction(this, 'FightersSyncFunction', {
      functionName: 'smash-bros-fighters-sync',
      entry: 'lambdas/fighters-sync/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_24_X,
      timeout: cdk.Duration.minutes(2),
      environment: {
        FIGHTERS_TABLE_NAME: fightersTable.tableName,
      },
    })

    fightersTable.grantWriteData(fightersSyncFn)

    new events.Rule(this, 'FightersWeeklySyncRule', {
      schedule: events.Schedule.cron({
        weekDay: 'MON',
        hour: '12',
        minute: '0',
      }),
      targets: [new targets.LambdaFunction(fightersSyncFn)],
    })

    const fightersBackfillFn = new lambdaNodejs.NodejsFunction(this, 'FightersBackfillFunction', {
      functionName: 'smash-bros-fighters-backfill',
      entry: 'lambdas/fighters-backfill/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_24_X,
      timeout: cdk.Duration.minutes(5),
      environment: {
        FIGHTERS_TABLE_NAME: fightersTable.tableName,
      },
    })

    fightersTable.grantWriteData(fightersBackfillFn)

    new triggers.Trigger(this, 'FightersBackfillTrigger', {
      handler: fightersBackfillFn,
      executeOnHandlerChange: false,
    })

    if (!props?.skipFrontend) {
      const hostedZone = route53.HostedZone.fromLookup(this, 'AnthonyGnlZone', {
        domainName: 'anthonygnl.com',
      })

      // CloudFront requires the certificate to be in us-east-1. DnsValidatedCertificate
      // handles this via a Lambda custom resource that calls ACM in us-east-1 at deploy
      // time — no need to bootstrap CDK in us-east-1.
      const certificate = new DnsValidatedCertificate(this, 'FrontendCertificate', {
        domainName: 'smashbros.anthonygnl.com',
        hostedZone,
        region: 'us-east-1',
      })

      const frontend = new Nextjs(this, 'SmashBrosFrontend', {
        nextjsPath: 'next-app',
        environment: {
          FIGHTERS_TABLE_NAME: fightersTable.tableName,
        },
        domainProps: {
          domainName: 'smashbros.anthonygnl.com',
          hostedZone,
          certificate,
        },
      })

      fightersTable.grantReadData(frontend.serverFunction.lambdaFunction)

      new cdk.CfnOutput(this, 'FrontendUrl', {
        value: 'https://smashbros.anthonygnl.com',
      })
    }
  }
}
