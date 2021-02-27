module.exports = {
  authGoogle: {
    clientID:
      "262517224867-kufcnkfvmehbscpl4q8tgvpd9sru5hpg.apps.googleusercontent.com",
    clientSecret: "gfjX6Zq09IwEJSfzIMnF6EiC",
    //
    callbackURL: "http://localhost:4000/auth/google/redirect",
  },
  authFacebook: {
    clientID: "322522312399138",
    clientSecret: "a2f2ba4a1e79396e547b00cd001f1fc6",
    callbackURL: "https://e-libraryapi.herokuapp.com/auth/facebook/redirect",
  },
  jwt_secret: "e-library@123",
  cloudinaryConfig: {
    cloud_name: "dps6fac1c",
    api_key: "656169371412842",
    api_secret: "thgAu5XIIxBPSeqtSZGboeb1D-M",
  },
};
