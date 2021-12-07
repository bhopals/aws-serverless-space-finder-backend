import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Runtime,
  Function as LambdaFunction,
} from "aws-cdk-lib/lib/aws-lambda";

import { RestApi, LambdaIntegration } from "aws-cdk-lib/lib/aws-apigateway";

import { join } from "path";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.handler",
    });

    //Hello Api Lambda Integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource('hello')
    helloLambdaResource;.addMethod('GET', helloLambdaIntegration)
  }
}
