import { EventBridge } from 'aws-sdk';

const eventbridge = new EventBridge();

const getTomorrow = () => {
  const now = new Date();
  const date = new Date();
  date.setDate(now.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDetails = (content) => ({
  id: content.originId.split('|')[1],
  origin: content.originId.split('|')[0],
  planId: content.planId,
  customerId: content.customerId,
  subscriptionId: content.subscriptionId,
  async: true,
  paymentMethod: content.paymentMethod,
  date: getTomorrow().toISOString(),
  token: content.when.split('|')[0],
  expiresAt: content.expiresAt,
});

const sendEventBridge = async (content) => {
  const response = await eventbridge
    .putEvents({
      Entries: [
        {
          Source: `hub-payment-scheduler-orders-${process.env.AWS_ENV}`,
          Detail: JSON.stringify(getDetails(content)),
          EventBusName: 'default',
          DetailType: 'default',
        },
      ],
    })
    .promise();
  console.log(response);
};

export { sendEventBridge };
