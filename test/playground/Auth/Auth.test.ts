import { AuthService } from "./AuthService";
import { config } from "./config";
import * as AWS from "aws-sdk";

const authService = new AuthService();

// const user = authService.login(
//   config.TEST_USER_NAME,
//   config.TEST_USER_PASSWORD
// );

async function callStuff() {
  const authService = new AuthService();
  const user = authService.login(
    config.TEST_USER_NAME,
    config.TEST_USER_PASSWORD
  );
  await authService.getAWSTemporaryCreds(user);
  const someCreds = AWS.config.credentials;
}

callStuff();
