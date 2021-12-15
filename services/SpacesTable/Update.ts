import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v3, v4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello From DynamoDB",
  };

  const requestBody =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

  if (requestBody && spaceId) {
    const requestBodyKey = Object.keys(requestBody)[0];
    const requestBodyValue = requestBody[requestBodyKey];
    const updateResult = await dbClient
      .update({
        TableName: TABLE_NAME,
        key: {
          [PRIMARY_KEY]: spaceId,
        },
        UpdateExpressions: "set #zzzNew = : new",
        ExpressionAttributeValue: {
          ":new": requestBodyValue,
        },
        ExpressionAttributeNames: {
          "#zzzNew": requestBodyKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
      .promise();

    result.body = JSON.stringify(updateResult);
  }

  // try {
  //   await dbClient
  //     .put({
  //       TableName: TABLE_NAME!,
  //       Item: item,
  //     })
  //     .promise();
  //   result.body = JSON.stringify(`Created Item with id: ${item.spaceId}`);
  // } catch (error: any) {
  //   result.body = error.message;
  // }

  return result;
}

export { handler };
