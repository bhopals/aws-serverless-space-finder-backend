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
    body: "Hello From DynamoDB DELETE",
  };

  try {
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];
    if (spaceId) {
      const deleteResult = await dbClient
        .delete({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: spaceId,
          },
        })
        .promise();
      result.body = JSON.stringify(deleteResult);
    }
  } catch (err: any) {
    result.body = JSON.stringify(err.body);
  }

  return result;
}

export { handler };
