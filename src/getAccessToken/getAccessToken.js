import axios from 'axios';

const getRequestBody = () => ({
  client_id: process.env.MERCADO_PAGO_CLIENT_ID,
  client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
  grant_type: 'client_credentials',
});

const getAccessToken = async () => {
  let token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (process.env.AWS_ENV === 'prod') {
    const { data } = await axios.post(
      `${process.env.MERCADO_PAGO_OAUTH}`,
      getRequestBody(),
    );
    token = data.access_token;
  }
  return token;
};

export { getAccessToken };
