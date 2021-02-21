const admin = require("firebase-admin");
const service_account = require("./e-library-705ec-firebase-adminsdk-rw603-085f602d68.json");

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(service_account),
  storageBucket: "gs://e-library-705ec.appspot.com",
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
  bucket,
};
