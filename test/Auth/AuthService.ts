import { Auth } from "aws-amplify";
import Amplify from "aws-amplify";
import { config } from "./config";
import { CognitoUser } from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userWebClientId: config.APP_CLIENT_ID,
  },
});

export class AuthService {
  public async login(userName: string, password: string) {}
}
