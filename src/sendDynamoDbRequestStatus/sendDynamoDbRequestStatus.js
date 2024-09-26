import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const getStatus = (attempts, gatewayId) => {
  if (gatewayId) {
    return 'processed';
  }
  return attempts < 5 ? 'pending' : 'error';
};

const sendDynamoDbRequestStatus = async (content, attempts, gatewayId) => {
  const status = getStatus(attempts, gatewayId);
  try {
    await dynamodb
      .updateItem({
        TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
        Key: {
          token: { S: content.when.split('|')[0] },
        },
        UpdateExpression:
          'set #attempts = :attempts , #status = :status , #updatedAt = :updatedAt , #gatewayId = :gatewayId',
        ConditionExpression:
          'attribute_exists(#token) AND #status <> :processed',
        ExpressionAttributeNames: {
          '#attempts': 'attempts',
          '#status': 'status',
          '#updatedAt': 'updatedAt',
          '#gatewayId': 'gatewayId',
          '#token': 'token',
        },
        ExpressionAttributeValues: {
          ':attempts': { S: `${attempts}` },
          ':status': { S: status },
          ':processed': { S: 'processed' },
          ':updatedAt': { S: new Date().toISOString() },
          ':gatewayId': { S: gatewayId ? `mercadopago|${gatewayId}` : '' },
        },
      })
      .promise();
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      console.log(`Token já processado anteriormente ${content.when}`);
    } else {
      throw err;
    }
  }
};

export { sendDynamoDbRequestStatus };
