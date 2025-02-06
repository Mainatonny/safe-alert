// config/paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');

const getEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    return new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  } else {
    return new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
  }
};

const client = new paypal.core.PayPalHttpClient(getEnvironment());
module.exports = client;
