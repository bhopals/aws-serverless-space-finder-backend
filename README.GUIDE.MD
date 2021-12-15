### Understanding AWS CDK

- It is an Abstraction of AWS Service
- Abstraction - Reusable component capable of hiding complex implementation.
- The abstraction is provided using Construct
- These Abstartions are reusable across the constructs and Stacks
- AWS CDK supports Multiple Languages
- It uses Javascript Interop Interface (JSII) under the hood
- TypeScript ==> JSII ==> Java, C#, Phyton, etc...

- Install AWS-CDK package globally - `npm i -g aws-cdk`
- Sample Stack Details - Refer - https://github.com/aws/aws-cdk

### Init First CDK Project

- create a directory in which you want to init your project

- `npm init app --language typescript`

- `cdk synth` - Generate Cloudformation template from CDK Application.
  AWS CDK apps are effectively only a definition of your infrastructure using code. When CDK apps are executed, they produce (or “synthesize”, in CDK parlance) an AWS CloudFormation template for each stack defined in your application. To synthesize (produce a code equivalent CloudFormation Template) a CDK app, use the cdk synth

- `cdk bootstrap` - It will create a CloudFormation Stack in our AWS Account
  The first time you deploy an AWS CDK app into an environment (account/region), you can install a “bootstrap stack”. This stack includes resources that are used in the toolkit’s operation. For example, the stack includes an S3 bucket that is used to store templates and assets during the deployment process.

You can use the cdk bootstrap command to install the bootstrap stack into an environment: `cdk bootdtrap`

- `cdk deploy` - Deploy the stack to AWS account. Add/Remove/Update AWS Resources

  - CDK deploy is the only command that you need to run everytime when you change your Construct and want to Deploy the Changes.
  - Use `cdk deploy --all` if you have multiple Stacks and want to deploy all
  - Use `cdk deploy <stack-name/id>` if you just want to deploy specific stack only

- `cdk init app --language typescript` (Initialize CDK project)
  Available templates:

  - app: Template for a CDK Application
    └─ cdk init app --language=[csharp|fsharp|go|java|javascript|python|typescript]

    - CDK Application Template

      - generated `cdk.json` file makes the generated project CDK Application/Project
      - `cdk.json` has 2 things - app and context

        - app - `npx ts-node --prefer-ts-exts bin/cdk-application-template.ts` (Starting point of our Application) - tells the toolkit how to run your app. (Refer - https://cdkworkshop.com/20-typescript/20-create-project/300-structure.html)
        - context - meta data for the CDK application

      - Now if we go to `bin/cdk-application-template.ts`
        - Create an AWS CDK instance - const app = new cdk.App();
        - Invoke the Stack Constructor by passing `app` instance, `name` and `props` - new <StackName>(app, `firstStack`, {})
        - Our whole stack Logic goes into the Constructor of <StackName> (CDK Application)

  - lib: Template for a CDK Construct Library
    └─ cdk init lib --language=typescript

  - sample-app: Example CDK Application with some constructs
    └─ cdk init sample-app --language=[csharp|fsharp|go|java|javascript|python|typescript]

- Other CDK Commands

  - `cdk list` - List out all the stacks
  - `cdk diff` - Compare the local stack v/s deployed stack
  - `cdk destroy` - To delete the Stack/AWS Resources
  - `cdk doctor` - Will show if there are any problems in our stack

- CDK Construct - A CDK Application consist of one or more Construct.
  When someone says construct, it means A class that can be initialized using Construct and acceptin <scope> as a construct.

  - @aws-cdk/aws-s3 - It is an S3 Construct Library
    - A Construct library can have `CFN-RESOURCES` and `CFN-CONSTRUCTS`
  - @aws-cdk/aws-sqs - It is a SQS Construct Library

- AWS Constructs (Three Types)
- L1 Construct - Low Level Construct - CFN Resources
- L2 Construct - Higher Level Construct - Intent-Based API - Per Resource One Construct (This is what We are Mostly be using )
- Even Higher Level - Patterns - Involves mutliple kinds of Resources - Group of Construct
- More Details - https://docs.aws.amazon.com/cdk/latest/guide/constructs.html

- CloudFormation Output - use `CfnOutput`
  new CfnOutput(this, "myBucket", {
  value: myBucket.bucketName,
  });
  Outputs: CdkApplicationTemplateStack.myBucket = cdkapplicationtemplatestack-somebucket8b32029d-1qqofot3pwy6w

  - The value would be in CloudFormation `output` section

- CfnParameter - For Input parameter pass down to the Stack
  const duration = new CfnParameter(this, "duration", {
  type: "Number",
  minValue: 1, //Validation - Wont allow less than 1
  maxValue: 10, //Validation - Wont allow more that 10
  default: 6, //if null or undefined, set 6
  });
  const myBucket = new Bucket(this, "someBucket", {
  lifecycleRules: [{ expiration: Duration.days(duration.valueAsNumber) }],
  });

  `cdk deploy --parameters duration=5`

  `cdk deploy --parameters duration=11` // Error - Parameter 'duration' must be a number not greater than 10

- Debugging issue - Always prefer to look into `aws-cdk` github page for known issues or enhancements - https://github.com/aws/aws-cdk/issues

### AWS Serverless Space Finder Backend

- Initialze node project - npm init -y
- Install npm packages - npm i -D aws-cdk aws-cdk-lib constructs ts-node typescript
- Create `Infrastructure` folder and add `Launcher.ts` (Entry Point) and `SpaceStack.ts` (Project Stack)
- Create `cdk.json` and add app/stack intializer code

### Build Lambda

1. Problem specific to TS and Node
   a. Node Lambda - with esbuild - fully integrated with CDK
   Node Lambda is a CDK Construct + esbuild Library, and its fully integrated with CDK
   b. Webpack - hard to configure

2. The effort will pay off:
   a. Fast Lambdas

- Lambda Bundling Problem:

  - Deploy Implementation and dependencies
  - Transform TS into JS

- Lambda DEPLOY Implementations:

  1.  MONO Repo - (Old way of doing - Not recommended)
      -> Deploy the node modules
      -> Hard Distinction between Lambdas
  2.  Node Lambda - Amazon NodeJS Library - AWS Construct - (Better)
      -> Experimental - not anymore
      -> Requires Docker installed - not anymore
      -> Docker Image/Installation(around 4GB) is required

      Solution - npm install --save-dev esbuild
      \*Esbuild to bundle your code in your environment. Otherwise, bundling will happen in a Lambda Compatible Docker Container

  3.  Webpack - (Best)
      -> initial Difficult configuration
      -> Small and fast bundles
      Solution:
      - npm i -D webpack webpack-cli ts-loader @types/webpack
      - create webpack.config.ts
      - create tsconfig.webpack.json
      - add npm run build - webpack

- TESTING and DEBUGGING Lambda

- Calling Lambda from Local Machine

  - make sure you have `ts-node` installed - npm dependency
  - create vscode launch.json - refer - test/vscode.json
  - Add Breakpoint in Lambda - services/node-lambda/hello.ts
  - create test file - test/playground/Hello.ts
  - Run the Test file

  - String and undefined

    - Add an Exclamation Mark in the back of the param - const mayBeUndefined! = process.env.NODE_ENV
    - Use `as` - const mayBeUndefined = process.env.NODE_ENV as string
    - Also at some places you could use `Optional Chaining` - office?.address?.street

  - DynamoDB client UPDATE do require you to pass a KEY attribute - {
    key: {
    [PRIMARY_KEY]: <PrimaryKeyValue>
    }
    }

- INPUT VALIDATIONS

  - Refer - shared/InputValidator.ts

- Generate 10 digits KEY in NODE
  - Math.random().toString(36).slice(2) // x4fjxpwug4t

REFERENCE

- AWS Typescript Workshop - https://cdkworkshop.com/20-typescript.html

- AWS Construct Libraries - https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html

- App Generator - https://cdkworkshop.com/20-typescript/20-create-project/100-cdk-init.html
