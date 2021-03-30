module.exports = {
  jwt_secret: "e-library@123",
  payPalConfig: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDBzkKt7u/CdljL\nmGsUKXA3L+A4iMw2saXo7qG6hYFq8JgHHsLXdR9JGaYR8p6FiVoVF/+Y+5V5Qunc\nsM7dLBnrLXGSBK4tYOngWpgShU0pyGOOmHvdb9AYEp01QgXtzh8+6HpFTXm9iXx/\n+YkmyuDF8jnqLejVhZtk5llDUslKfcp9GKYqFQArA5mrNRscfpvTaEbC6aq95SAW\njtlQBUnSiNx1BaLW6gkTa006D/mrJouyVpxB0iLjxGZnZssq9469xa2oYRHSdc2T\n5qd/xLyoaH/JZNepKPgxfnGxAz5CwgMCcb64a1Gn8pWdp11VppgeXF00pLhEzhrH\n3xkaixaZAgMBAAECggEABsEVedJV8MUHGzFYqf83tfSpL880rsNKMPAAGuwEMqHn\n6neb+r5ONNH8A6wc8jJzPUD023QJJYy7ccGHtBWRYazXxGr9Vv+FpxgBLMQQiGA/\nd/zAdFstOWmMqQqAAmWomRypBjlJAN4FxMABk6SGaN+kPREUiDx7yextN/dupHXm\nSMlGqKOWu0JfxsuYBja8VkjU/qlsdw3wOLETuLQxGOoRWLGoxtFDykfEtHBOMLRD\nwKXYc+fovpXGc/2GFCR7q2GLdAOht6rvUx6KDhrwlNE9kXzdc0R0RsvuIFjx9/2H\n7B1+FQJd4YzPz8pQ6i9kJ71Yz5JYGEDHRZBEBQer8QKBgQDqlI2KnhpT4yhGh3Z/\ndcPJb0sfUKKhN/Fko8yeguHMs+QuAYsd6hIw7qRlePTHb5KAPmYf3zi4OImNSujX\nNYkBSVP/riAYVuDPEMLvcUNPQnKsYpzbGjCDwmJ0fOTGQ3AGjiR7OQg7BW+m86Rg\n1R5ywn5AcVhkv6BGUhVhvsyq/wKBgQDTgJQi9DCLO6CzZp4DA6yjM5ACSo2GG21Q\nAEmUt6DSLfr0+ooL0imY+q7PEpcXOCovqnUR7uNRuxZqn2imNbSDm1AvXztmgckd\nN5wwlj1tbO3vygoC0gHrxoMAwlh+K1Az3Q3NTgUP60nXSHv1RcP17sDopyXOhYeM\n6YKzoF+2ZwKBgQCD43fdGt00kv/+/4SpTx4AMDmtZpm5SQnIiqut52pqvC2rjCSa\nchM+Pb5iauo9A0b8IZkrjEaIlQkJTrew4CGifobitxTGeno1EXh4RVcRxgtRTrRg\nH85tFipi0iGSMzJWDS8HtN4iyQCofk3KP6i53w46zz9ijbbgMqBg73SFIwKBgQDN\nJdqKTPEJHD0zxkVeByJc6pa0ojvD6LaO8rhsV/DV7WOOW7Wq4Z8Xk5AbqpyDGSdS\nNLR5QI2dqSqFIToQfecqAGw2htjHBPxeKqKFPjU2/oGMJRywv6K9Xz+SbPAI8VpJ\n9BB/Iz4lwsNM3jHeJl19HqhfAkHZoAtq0tTEBrrP4QKBgQDLWd4TWc2R65V4C7Du\nK3WRfTpFPFAJCSTDUW/uEQzE7dIiazkDmfglH7e88LXY6z/I4jwZEOnPbo801bQo\nytDs/c55dlLBTLWY27SY2mHmFJN9dDcJ72evn+kxsmxSu9meBfCE1u7qTTb1u13K\nygDcSIR9bSvNYcn8xEN8TOT+fw==\n-----END PRIVATE KEY-----\n",
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_IX509_CERT_URL,
  },
};
