import { Stack } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export interface TableProps {
  tableName: string;
  primaryKey: string;
  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
}

export class GenericTable {
  private name: string;
  private primaryKey: string;
  private stack: Stack;
  private table: Table;

  private createLambda: NodejsFunction | undefined;
  private readLambda: NodejsFunction | undefined;
  private updateLambda: NodejsFunction | undefined;
  private deleteLambda: NodejsFunction | undefined;

  public createLamabdaIntegration: LambdaIntegration;
  public readLamabdaIntegration: LambdaIntegration;
  public updateLamabdaIntegration: LambdaIntegration;
  public deleteLamabdaIntegration: LambdaIntegration;

  public constructor(name: string, primaryKey: string, stack: Stack) {
    this.name = name;
    this.primaryKey = primaryKey;
    this.stack = stack;
    this.initialize();
  }

  private initialize() {
    this.createTable();
  }

  private createTable() {
    this.table = new Table(this.stack, this.name, {
      partitionKey: {
        name: this.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.name,
    });
  }
}
