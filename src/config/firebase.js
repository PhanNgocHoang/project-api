const admin = require("firebase-admin");
const { firebase } = require("./config");

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
