import { DynamoDB } from "aws-sdk";
import {
  MissingFieldError,
  validateAsSpaceEntry,
} from "../shared/inputValidator";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
// import { v4 } from "uuid";
import { generateRandomId, getEventBody } from "../shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello From DynamoDB",
  };

  try {
    const item = getEventBody(event);
    // item.spaceId = v4();
    item.spaceId = generateRandomId();
    validateAsSpaceEntry(item);
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(`Created Item with id: ${item.spaceId}`);
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }
    result.body = error.message;
  }

  return result;
}

export { handler };
