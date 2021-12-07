import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
export declare class SpaceStack extends Stack {
    private api;
    private spacesTable;
    constructor(scope: Construct, id: string, props: StackProps);
}
