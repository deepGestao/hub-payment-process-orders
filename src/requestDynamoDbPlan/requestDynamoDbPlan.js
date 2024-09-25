import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const requestDynamoDbPlan = async (planId) => {
  const result = {
    token: '',
    amount: 0,
    frequency: 0,
    frequencyType: '',
    originId: '',
    reason: '',
  };
  const response = await dynamodb
    .getItem({
      TableName: `hub-payment-plans-${process.env.AWS_ENV}`,
      Key: {
        token: { S: planId },
      },
    })
    .promise();
  if (response && response.Item) {
    const data = DynamoDB.Converter.unmarshall(response.Item);
    result.token = data.token;
    result.frequency = parseInt(data.frequency, 10);
    result.frequencyType = data.frequencyType;
    result.originId = data.originId;
    result.reason = data.reason;
    result.amount = parseInt(data.amount, 10);
  }
  return result;
};

export { requestDynamoDbPlan };
