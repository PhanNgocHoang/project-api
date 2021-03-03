const JWT = require("jsonwebtoken");
const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { jwt_secret } = require("../config/config");
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
      if (err) throw new Error(error.message);
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
module.exports.findUserByGoogleId = async (googleId) => {
  const user = await User.findOne({ googleId: googleId });
  return user;
};
module.exports.findUserByFacebookId = async (facebookId) => {
  const user = await User.findOne({ fbId: facebookId });
  return user;
};
module.exports.findUserById = async (id) => {
  const user = await User.findOne({ _id: id });
  return user;
};
module.exports.updateWallet = async (userId, newWallet) => {
  const user = await User.findOne({ _id: userId });
  user.wallet = user.wallet + newWallet;
  await user.save();
  return user.wallet;
};
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
