import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v3, v4 } from "uuid";

const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello From DynamoDB",
  };

  const item =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  item.spaceId = v4();

  try {
    await dbClient
      .put({
        TableName: "SpacesTable",
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(`Created Item with id: ${item.spaceId}`);
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

export { handler };
