import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Runtime,
  Function as LambdaFunction,
} from "aws-cdk-lib/aws-lambda";

import {
  RestApi,
  LambdaIntegration,
  MethodOptions,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";

import { join } from "path";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AuthorizerWrapper } from "./auth/AuthorizerWrapper";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private authorizer: AuthorizerWrapper;
  private suffix: string;
  private spacePhotosBucket: Bucket;

  private spacesTable = new GenericTable(this, {
    tableName: "spacesTable",
    primaryKey: "space-id",
    createLambdaPath: "Create",
    readLambdaPath: "Read",
    updateLambdaPath: "Update",
    deleteLambdaPath: "Delete",
    secondaryIndexes: ["location"],
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.initializeSuffix();
    this.inititializeSpacesPhotosBucket();
    this.authorizer = new AuthorizerWrapper(
      this,
      this.api,
      this.spacePhotosBucket.bucketArn + "/*"
    );

    // const helloLambda = new LambdaFunction(this, "helloLambda", {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
    //   handler: "hello.handler",
    // });

    // const helloLambdaNodeJS = new NodejsFunction(this, "helloNodeLambda", {
    //   entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
    //   handler: "handler",
    // });

    // const s3ListPolicy = new PolicyStatement();
    // s3ListPolicy.addActions("s3:ListAllMyBuckets");
    // s3ListPolicy.addResources("*");
    // helloLambdaNodeJS.addToRolePolicy(s3ListPolicy);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    };

    // Webpack
    // const helloLambdaWebpack = new LambdaFunction(this, "helloLambdaWebPack", {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: Code.fromAsset(join(__dirname, "..", "build", "nodeHelloLambda")),
    //   handler: "nodeHelloLambda.handler",
    // });

    //Hello Api Lambda Integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod(
      "GET",
      helloLambdaIntegration,
      optionsWithAuthorizer
    );

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

  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    const suffix = Fn.select(4, Fn.split("-", shortStackId));
    this.suffix = suffix;
  }

  private inititializeSpacesPhotosBucket() {
    this.spacePhotosBucket = new Bucket(this, "spaces-photos", {
      bucketName: "spaces-photos-" + this.suffix,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.PUT, HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });
    new CfnOutput(this, "space-photos-bucket-name", {
      value: this.spacePhotosBucket.bucketName,
    });
  }
}
