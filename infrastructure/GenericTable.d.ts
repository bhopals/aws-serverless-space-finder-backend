import { Stack } from "aws-cdk-lib";
export declare class GenericTable {
    private name;
    private primaryKey;
    private stack;
    private table;
    constructor(name: string, primaryKey: string, stack: Stack);
    private initialize;
    private createTable;
}
