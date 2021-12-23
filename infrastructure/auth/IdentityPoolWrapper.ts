import { CfnOutput } from "aws-cdk-lib";
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
} from "aws-cdk-lib/aws-cognito";
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class IdentityPoolWrapper {
  private scope: Construct;

  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private IdentityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;

  private adminRole: Role;

  constructor(
    scope: Construct,
    userPool: UserPool,
    userPoolClient: UserPoolClient
  ) {
    this.userPool = userPool;
    this.scope = scope;
    this.userPoolClient = userPoolClient;
    this.initialize();
  }

  private initialize() {
    this.initilizeIdentityPool();
    this.initializeIAMRoles();
  }

  private initilizeIdentityPool() {
    this.IdentityPool = new CfnIdentityPool(
      this.scope,
      "SpaceFinderIdentityPool",
      {
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      }
    );
    new CfnOutput(this.scope, "IdentityPoolId", {
      value: this.IdentityPool.ref,
    });
  }

  private initializeIAMRoles() {
    this.authenticatedRole = new Role(
      this.scope,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
          Action: "sts:AssumeRoleWithWebIdentity",
        }),
      }
    );
    // this.authenticatedRole.addToPolicy(//TODO)

    this.unAuthenticatedRole = new Role(
      this.scope,
      "CognitoDefaultUnAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
          Action: "sts:AssumeRoleWithWebIdentity",
        }),
      }
    );

    // this.unAuthenticatedRole.addToPolicy(//TODO)

    this.adminRole = new Role(this.scope, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated",
        },
        Action: "sts:AssumeRoleWithWebIdentity",
      }),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListAllMyBuckets"],
        resources: ["*"],
      })
    );
  }
}
