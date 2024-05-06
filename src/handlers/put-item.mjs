// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    console.log('Table Name -', tableName)

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const paramEmailAddress = body.emailAddress;
    const paramName = body.name;
    const surname = body.surname

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { emailAddress : paramEmailAddress, name: paramName }
    };



    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Added item to DynamoDB")
      } catch (err) {
        console.error("Error adding item to DynamoDB:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "failed to insert item to DynamoDB"})
        }
      }

    const responseBody = {
        statusCode: 200,
        body: JSON.stringify({message:"Item added successfully"})
    };

    // All log statements are written to CloudWatch
    // console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return responseBody;
};
