const admin = require("firebase-admin");
const firebase = require("./e-library-705ec-firebase-adminsdk-rw603-c244dd2e2b.json");

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebase),
  storageBucket: "gs://e-library-705ec.appspot.com",
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
  bucket,
};
