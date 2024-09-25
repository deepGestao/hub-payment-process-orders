import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const sendDynamoDbRequestStatus = async (content, attempts, gatewayId) => {
  await dynamodb
    .updateItem({
      TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
      Key: {
        token: { S: content.when.split('|')[0] },
      },
      UpdateExpression: 'set #attempts = :attempts , #status = :status , #updatedAt = :updatedAt , #gatewayId = :gatewayId',
      ExpressionAttributeNames: {
        '#attempts': 'attempts',
        '#status': 'status',
        '#updatedAt': 'updatedAt',
        '#gatewayId': 'gatewayId',
      },
      ExpressionAttributeValues: {
        ':attempts': { S: `${attempts}` },
        ':status': { S: attempts < 5 ? 'pending' : 'error' },
        ':updatedAt': { S: new Date().toISOString() },
        ':gatewayId': { S: gatewayId ? `mercadopago|${gatewayId}` : '' },
      },
    })
    .promise();
};

export { sendDynamoDbRequestStatus };
