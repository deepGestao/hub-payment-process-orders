import axios from 'axios';
import { getAccessToken } from '../getAccessToken/getAccessToken';

const getHeaders = (token, content) => ({
  'Content-Type': 'application/json',
  'X-Idempotency-Key': `${content.when.split('|')[0]}|${new Date().setHours(0, 0, 0, 0)}`,
  Authorization: `Bearer ${token}`,
});

const getConfig = (token, content) => ({
  headers: getHeaders(token, content),
  timeout: 20000,
});

const getRequestBody = (content) => ({
  additional_info: {
    items: [
      {
        id: content.planId,
        title: content.reason,
        description: content.reason,
        quantity: 1,
        unit_price: parseFloat(content.amount),
        event_date: new Date().toISOString(),
        warranty: false,
      },
    ],
    payer: {
      first_name: content.name,
      last_name: content.lastName,
      address: {
        zip_code: content.zipCode,
        street_name: content.streetName,
        street_number: parseInt(content.streetNumber, 10),
      },
    },
  },
  binary_mode: true,
  description: content.reason,
  date_of_expiration: content.expiresAt,
  external_reference: content.when.split('|')[0],
  payment_method_id: content.paymentMethod,
  installments: 1,
  payer: {
    first_name: content.name,
    last_name: content.lastName,
    email: content.email,
    identification: {
      type: content.document.length > 11 ? 'CNPJ' : 'CPF',
      number: content.document,
    },
  },
  transaction_amount: parseFloat(content.amount),
});

const requestGateway = async (content) => {
  const token = await getAccessToken();
  const result = { id: '' };
  await axios.post(
    process.env.MERCADO_PAGO_PAYMENT,
    getRequestBody(content),
    getConfig(token, content),
  )
    .then((response) => {
      result.id = response.data.id;
    })
    .catch((e) => {
      console.error(e);
    });
  return result.id;
};

export { requestGateway };
