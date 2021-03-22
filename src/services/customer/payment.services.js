const { payPalConfig } = require("../../config/config");
const axios = require("axios");
const querystring = require("querystring");

module.exports.checkPayment = async (paymentId) => {
  try {
    const data = querystring.stringify({
      grant_type: "client_credentials",
    });
    const response = await axios.default.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: payPalConfig.client_id,
          password: payPalConfig.client_secret,
        },
      }
    );
    const paymentDetail = await axios.default.get(
      `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}`,
      {
        headers: {
          Accept: `application/json`,
          Authorization: `Bearer ${response.data.access_token}`,
        },
      }
    );
    return paymentDetail.data.transactions[0];
  } catch (error) {
    return null;
  }
};
