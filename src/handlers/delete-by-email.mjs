// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP get method to delete one item by id from a DynamoDB table.
 */
export const deleteByIdHandler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{emailAddress}` at template.yaml
  const emailAddress = event.pathParameters.emailAddress;
 
  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  var params = {
    TableName : tableName,
    Key: { emailAddress: emailAddress },
  };

  try {
    const data = await ddbDocClient.send(new DeleteCommand(params));
    console.log("Succesfully deleted item by id")
  } catch (err) {
    
    console.error("Unable to delete item", err);
    return {
      statusCode: data.$metadata.httpStatusCode,
      message: "Unable to find item" 

    }
  }
 
  const response = {
    statusCode: 200,
    message: "successfully deleted item"
  };
 
  // All log statements are written to CloudWatch
  // console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
