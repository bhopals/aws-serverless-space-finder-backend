import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Runtime,
  Function as LambdaFunction,
} from "aws-cdk-lib/aws-lambda";

import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import { join } from "path";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");

  private spacesTable = new GenericTable(this, {
    tableName: "spacesTable",
    primaryKey: "space-id",
    createLambdaPath: "Create",
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.handler",
    });

    const helloLambdaNodeJS = new NodejsFunction(this, "helloNodeLambda", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");
    helloLambdaNodeJS.addToRolePolicy(s3ListPolicy);

    // Webpack
    // const helloLambdaWebpack = new LambdaFunction(this, "helloLambdaWebPack", {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: Code.fromAsset(join(__dirname, "..", "build", "nodeHelloLambda")),
    //   handler: "nodeHelloLambda.handler",
    // });

    //Hello Api Lambda Integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);

    //SPACES API Integration
    const spaceResources = this.api.root.addResource("spaces");
    spaceResources.addMethod("POST", this.spacesTable.createLamabdaIntegration);
    spaceResources.addMethod("GET", this.spacesTable.readLamabdaIntegration);
    spaceResources.addMethod("PUT", this.spacesTable.updateLamabdaIntegration);
    spaceResources.addMethod(
      "DELETE",
      this.spacesTable.deleteLamabdaIntegration
    );
  }
}
