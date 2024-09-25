import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const sendDynamoDbRequest = async (content, isSuccess) => {
  const contentParsed = content;
  await dynamodb
    .deleteItem({
      TableName: `hub-payment-scheduler-queue-${process.env.AWS_ENV}`,
      Key: {
        token: { S: content.token },
        when: { S: content.when },
      },
    })
    .promise();
  contentParsed.token = isSuccess ? 'success' : 'error';
  await dynamodb
    .putItem({
      TableName: `hub-payment-scheduler-queue-${process.env.AWS_ENV}`,
      Item: DynamoDB.Converter.marshall(contentParsed),
    })
    .promise();
};

export { sendDynamoDbRequest };
