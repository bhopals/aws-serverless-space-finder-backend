import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function as LambdaFunction } from "aws-cdk-lib/lib/aws-lambda";
import { join } from "path";

export class SpaceStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "helloLambda", {});
  }
}
