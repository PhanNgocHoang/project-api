const JWT = require("jsonwebtoken");
const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { jwt_secret, authGoogle, authFacebook } = require("../config/config");
module.exports.encodedToken = (role, email, id) => {
  return JWT.sign(
    {
      iss: email,
      id: id,
      sub: role,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    jwt_secret
  );
};
module.exports.verifyToken = (token) => {
  return JWT.verify(token, jwt_secret);
};
module.exports.register = async (
  email,
  password,
  displayName,
  role,
  photoUrl
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      password: password,
      displayName: displayName,
      role: role,
      photoUrl: photoUrl,
    });
    await user.save((err, data) => {
      if (err) console.log("error", err);
      console.log(data);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports.getMe = async (id) => {
  const me = await User.findById(id);
  return me;
};
module.exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  const result = await bcrypt.compare(password, user.password);
  if (user && result == true) {
    return {
      userInfo: user,
      token: this.encodedToken(user.role, user.email, user.password),
    };
  }
};
module.exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};
module.exports.forgetPassword = async (email, newPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
    await User.updateOne({ email: email }, { password: newPassword });
  } catch (error) {
    throw new Error(error);
  }
};
passport.use(
  new GoogleStrategy(
    {
      clientID: authGoogle.clientID,
      clientSecret: authGoogle.clientSecret,
      callbackURL: authGoogle.callbackURL,
    },
    async (accessToke, refreshToke, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      }
      const userData = new User({
        email: profile.emails,
        password: profile.emails,
        displayName: profile.displayName,
        role: "USER",
        photoUrl: profile.photos,
      });
      userData.save((newUser) => {
        done(null, newUser);
      });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: authFacebook.clientID,
      clientSecret: authFacebook.clientSecret,
      callbackURL: authFacebook.callbackURL,
    },
    async (accessToke, refreshToke, profile, done) => {
      console.log(profile);
      const user = await User.findOne({ fbId: profile.id });
      if (user) {
        done(null, user);
      }
      const userData = new User({
        fbId: profile.id,
        email: profile.emails,
        dob: profile.birthday,
        displayName: profile.displayName,
        role: "USER",
        photoUrl: profile.photos,
      });
      userData.save((newUser) => {
        done(null, newUser);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
