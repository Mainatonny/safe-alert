const paypal = require('@paypal/checkout-server-sdk');

const getEnvironment = () => {
  if (process.env.PAYPAL_MODE === 'sandbox') {
    // Use Sandbox for testing
    return new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
  } else {
    // Use Live for real transactions
    return new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
  }
};

const client = new paypal.core.PayPalHttpClient(getEnvironment());
module.exports = client;

