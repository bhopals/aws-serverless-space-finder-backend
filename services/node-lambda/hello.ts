import { v4 } from "uuid";
import { S3 } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log("Got an Event!!", event);

  return {
    statusCode: 200,
    body: {
      message: "Hello From Node Lambda!!" + v4(),
      detalis: JSON.stringify(buckets.Buckets),
    },
  };
}

export { handler };
