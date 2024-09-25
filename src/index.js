import { requestDynamoDbOrders } from './requestDynamoDbOrders/requestDynamoDbOrders';
import { requestGateway } from './requestGateway/requestGateway';
import { sendDynamoDbRequestStatus } from './sendDynamoDbRequestStatus/sendDynamoDbRequestStatus';
import { sendDynamoDbRequest } from './sendDynamoDbRequest/sendDynamoDbRequest';

const processItems = async (content) => {
  const result = await Promise.allSettled(content.map(async (item) => {
    const gatewayId = await requestGateway(item);
    const { attempts } = await requestDynamoDbOrders(item.when.split('|')[0]);
    await sendDynamoDbRequestStatus(item, attempts + 1, gatewayId);
    await sendDynamoDbRequest(item, !!(gatewayId));
  }));
  console.log(JSON.stringify(result));
};

const handler = async (event, context) => {
  console.log(event, context);
  const content = JSON.parse(event.Records[0].body);
  console.log(content);
  try {
    await processItems(content);
    return {
      statusCode: 200,
      body: '{}',
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'internal server error' }),
    };
  }
};

export { handler };
