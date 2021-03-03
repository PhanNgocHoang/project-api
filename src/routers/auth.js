const routers = require("express").Router();
const AuthService = require("../services/users");
const joi = require("@hapi/joi");
const { authMiddleware } = require("../middlewares/auth");
const axios = require("axios");
const User = require("../models/users.model");

routers.get("/me", authMiddleware(true), (req, res, next) => {
  res.status(200).json(req.user);
});
routers.post("/login", async (req, res, next) => {
  try {
    const bodySchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    const userData = await bodySchema.validateAsync(req.body);
    const user = await AuthService.login(userData.email, userData.password);
    if (!user) {
      return res.status(400).json({ message: "Wrong email or password" });
    }
    return res.status(200).json({ user: user.userInfo, token: user.token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/register", async (req, res, next) => {
  try {
    const bodySchema = joi
      .object({
        email: joi.string().email().required(),
        password: joi.string().required(),
        displayName: joi.string().required(),
        role: joi.string().required(),
        photoUrl: joi.string(),
        dob: joi.date().required(),
      })
      .unknown();
    const userData = await bodySchema.validateAsync(req.body);
    const user = await AuthService.findUserByEmail(userData.email);
    if (user != null) {
      return res.status(400).json({ message: "Email is exist" });
    }
    if (userData.error) {
      return res.status(400).json({ message: userData.error.message });
    }
    await AuthService.register(
      userData.email,
      userData.password,
      userData.displayName,
      userData.role,
      userData.photoUrl,
      userData.gender
    );
    return res.status(200).json({ message: "Registration successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

routers.post("/google", async (req, res) => {
  try {
    const response = await axios.default.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${req.body.access_token}`
    );
    if (response.data) {
      const user = await AuthService.findUserByGoogleId(response.data.id);
      if (user != null) {
        const token = AuthService.encodedToken(user.role, user.email, user._id);
        return res.status(200).json({ user: user, token: token });
      } else {
        const newUser = new User({
          googleId: response.data.id,
          email: response.data.email,
          displayName: response.data.name,
          photoUrl: response.data.picture,
        });
        const userData = await newUser.save();
        const token = AuthService.encodedToken(
          userData.role,
          userData.email,
          userData._id
        );
        return res.status(200).json({ user: userData, token: token });
      }
    } else {
      return res.status(400).json({ message: "" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/facebook", async (req, res) => {
  try {
    const access_token = req.body.access_token;
    const userId = req.body.user_id;
    const response = await axios.default.get(
      `https://graph.facebook.com/${userId}?fields=name,email,picture&access_token=${access_token}`
    );
    if (response.data) {
      const user = await AuthService.findUserByFacebookId(response.data.id);
      if (user != null) {
        const token = AuthService.encodedToken(user.role, user.email, user._id);
        return res.status(200).json({ user: user, token: token });
      }
      const newUser = new User({
        fbId: response.data.id,
        email: response.data.email,
        displayName: response.data.name,
        photoUrl: response.data.picture.data.url,
      });
      const userData = await newUser.save();
      const token = AuthService.encodedToken(
        userData.role,
        userData.email,
        userData._id
      );
      return res.status(200).json({ user: userData, token: token });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/me/:id", async (req, res) => {
  const me = await AuthService.getMe(req.params.id);
  return res.status(200).json({ user: me });
});
module.exports = routers;
