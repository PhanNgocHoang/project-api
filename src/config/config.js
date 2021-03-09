module.exports = {
  jwt_secret: "e-library@123",
  payPalConfig: {
    client_id:
      "AfLlRTEa5ycxVw8FqhjFLlRJrNDdk_BLpe_oilcIn4M8kIhDMQVEptAbDKbeiKN-FfgfL9ruRdge-zGF",
    client_secret:
      "EB77G4HQ57rtXPDBQDmzutyuxQvI39t-fuVpakZ6y8VytqLsm3YdazYjf-B-PGcx1qysb6FYVL7Fh-Uu",
  },
  firebase: {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_IX509_CERT_URL,
  },
};
