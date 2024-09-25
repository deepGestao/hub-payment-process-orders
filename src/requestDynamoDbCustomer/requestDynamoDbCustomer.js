import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const requestDynamoDbCustomer = async (customerId) => {
  const result = {
    email: '',
    address: {
      zipCode: '',
      streetName: '',
      streetNumber: '',
    },
    name: '',
    lastName: '',
    document: '',
    contact: '',
  };
  const response = await dynamodb.getItem({
    TableName: `hub-payment-customers-${process.env.AWS_ENV}`,
    Key: {
      token: { S: customerId },
    },
  }).promise();
  if (response && response.Item) {
    const data = DynamoDB.Converter.unmarshall(response.Item);
    result.name = data.name;
    result.document = data.document;
    result.contact = data.contact;
    result.email = data.email;
    result.lastName = data.lastName;
    result.address.zipCode = data.zipCode;
    result.address.streetName = data.streetName;
    result.address.streetNumber = data.streetNumber;
  }
  return result;
};

export { requestDynamoDbCustomer };
