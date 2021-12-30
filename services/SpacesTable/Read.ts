import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { addCorsHeader } from "../shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello From DynamoDB",
  };
  addCorsHeader(result);

  let queryResponse;
  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(
          event.queryStringParameters!
        );
      } else {
        result.body = await queryWithSecondaryPartition(
          event.queryStringParameters!
        );
      }
    } else {
      result.body = await scanTable();
    }
  } catch (error: any) {
    result.body = error.message;
  }

  async function queryWithSecondaryPartition(
    queryParams: APIGatewayProxyEventQueryStringParameters
  ) {
    const keyValue = queryParams[PRIMARY_KEY!];
    queryResponse = await dbClient
      .query({
        KeyConditionExpression: "#zz = :zzzz",
        ExpressionAttributeNames: {
          "#zz": PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
          ":zzzz": keyValue,
        },
        TableName: TABLE_NAME!,
      })
      .promise();
    return JSON.stringify(queryResponse.Items);
  }

  async function queryWithPrimaryPartition(
    queryParams: APIGatewayProxyEventQueryStringParameters
  ) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];
    queryResponse = await dbClient
      .query({
        IndexName: queryKey,
        KeyConditionExpression: "#zz = :zzzz",
        ExpressionAttributeNames: {
          "#zz": queryKey!,
        },
        ExpressionAttributeValues: {
          ":zzzz": queryValue,
        },
        TableName: TABLE_NAME!,
      })
      .promise();
    return JSON.stringify(queryResponse.Items);
  }

  async function scanTable() {
    const queryResponse = await dbClient
      .scan({
        TableName: TABLE_NAME!,
      })
      .promise();
    return JSON.stringify(queryResponse.Items);
  }

  return result;
}

export { handler };
