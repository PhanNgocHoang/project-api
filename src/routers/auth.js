const routers = require("express").Router();
const AuthService = require("../services/users");
const joi = require("@hapi/joi");
const { authMiddleware } = require("../middlewares/auth");
const axios = require("axios");
const User = require("../models/users.model");
const gridMail = require("@sendgrid/mail");
const generatePassword = require("generate-password");
gridMail.setApiKey(
  "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"
);

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
    gridMail
      .send({
        to: {
          email: userData.email,
        },
        templateId: "d-e4a7316604634d2cb081b67ede3f94ca",
        dynamicTemplateData: {
          displayName: userData.displayName,
        },
        from: {
          email: "hoangpn.dev@gmail.com",
          name: "Admin",
        },
      })
      .then(() => {
        return res.status(200).json({ user: userData, token: token });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
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
        gridMail
          .send({
            to: {
              email: response.data.email,
            },
            templateId: "d-e4a7316604634d2cb081b67ede3f94ca",
            dynamicTemplateData: {
              displayName: response.data.name,
            },
            from: {
              email: "hoangpn.dev@gmail.com",
              name: "Admin",
            },
          })
          .then(() => {
            return res.status(200).json({ user: userData, token: token });
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      }
    } else {
      return res.status(400).json({ message: "Can not sign in with Google" });
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
      if (response.data.email || response.data.email != null) {
        gridMail
          .send({
            to: {
              email: response.data.email,
            },
            templateId: "d-e4a7316604634d2cb081b67ede3f94ca",
            dynamicTemplateData: {
              displayName: response.data.name,
            },
            from: {
              email: "hoangpn.dev@gmail.com",
              name: "Admin",
            },
          })
          .then(() => {
            return res.status(200).json({ user: userData, token: token });
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      }
      return res.status(200).json({ user: userData, token: token });
    }
    return res.status(400).json({ message: "Can not sign in with facebook" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.put("/updateMe", authMiddleware(true), async (req, res) => {
  try {
    const payload = req.body;
    const user = await AuthService.updateMe(req.user, payload);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.put("/changePassword", authMiddleware(true), async (req, res) => {
  try {
    const bodySchema = joi
      .object({
        cr_password: joi.string().required("Current password is required"),
        n_password: joi.string().required("New password is required"),
      })
      .unknown();
    const userData = await bodySchema.validateAsync(req.body);
    if (userData.error) {
      return res.status(400).json({ message: userData.error.message });
    }
    const result = await AuthService.changePassword(
      req.user._id,
      req.body.cr_password,
      req.body.n_password
    );
    if (result == false) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    return res.status(200).json({ message: "Change password successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.put("/forgetPassword", async (req, res) => {
  try {
    const bodySchema = joi
      .object({
        email: joi.string().required("Your Email is required"),
      })
      .unknown();
    const userData = await bodySchema.validateAsync({ email: req.body.email });
    if (userData.error) {
      return res.status(400).json({ message: userData.error.message });
    }
    const user = await AuthService.findUserByEmail(userData.email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.googleId != null || user.fbId != null) {
      return res
        .status(400)
        .json({ message: "Please using google or facebook to sign in" });
    }
    const newPassword = generatePassword.generate({
      length: 8,
      numbers: true,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true,
      symbols: true,
      strict: true,
    });
    gridMail
      .send({
        to: {
          email: user.email,
        },
        templateId: "d-4bf79d04ca8c4b1b90b5a4a2f33a0df9",
        dynamicTemplateData: {
          displayName: user.displayName,
          password: newPassword,
        },
        from: {
          email: "hoangpn.dev@gmail.com",
          name: "Admin",
        },
      })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Please check your email to get password." });
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = routers;
