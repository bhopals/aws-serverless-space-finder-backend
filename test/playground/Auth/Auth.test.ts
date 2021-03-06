import { AuthService } from "./AuthService";
import { config } from "./config";
import * as AWS from "aws-sdk";

AWS.config.region = config.REGION;

const authService = new AuthService();

// const user = authService.login(
//    config.TEST_USER_NAME,
//    config.TEST_USER_PASSWORD
// );

async function getBuckets() {
  let buckets;

  try {
    buckets = await new AWS.S3().listBuckets().promise();
  } catch (error: any) {
    buckets = undefined;
  }
  return buckets;
}

async function callStuff() {
  const authService = new AuthService();
  const user = authService.login(
    config.TEST_USER_NAME,
    config.TEST_USER_PASSWORD
  );
  await authService.getAWSTemporaryCreds(user);
  const someCreds = AWS.config.credentials;
  const buckets = getBuckets();
}

callStuff();
