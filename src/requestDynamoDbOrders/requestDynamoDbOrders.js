import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const requestDynamoDbOrders = async (orderId) => {
  const result = {
    attempts: 0,
  };
  const response = await dynamodb.getItem({
    TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
    Key: {
      token: { S: orderId },
    },
  }).promise();
  if (response && response.Item) {
    const data = DynamoDB.Converter.unmarshall(response.Item);
    result.attempts = parseInt(data.attempts, 10);
  }
  return result;
};

export { requestDynamoDbOrders };
