const routers = require("express").Router();
const AuthService = require("../services/users");
const joi = require("@hapi/joi");
const createError = require("http-errors");
const passport = require("passport");
const { authMiddleware } = require("../middlewares/auth");

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
    next(error);
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

routers.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

routers.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  const token = AuthService.encodedToken(
    req.user.role,
    req.user.email,
    req.user._id
  );
  const html = `<html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${token}');
        // Redirect browser to root of application
        window.location.href = 'https://e-libraryapi.herokuapp.com/';
      </script>
    </html>  `;
  res.send(html);
});

routers.get("/me/:id", async (req, res) => {
  const me = await AuthService.getMe(req.params.id);
  return res.status(200).json({ user: me });
});
routers.get("/facebook", passport.authenticate("facebook"));
routers.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    const token = AuthService.encodedToken(
      req.user.role,
      req.user.email,
      req.user._id
    );
    const html = `<html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${token}');
        // Redirect browser to root of application
        window.location.href = 'https://e-libraryapi.herokuapp.com';
      </script>
    </html>  `;
    res.send(html);
  }
);
module.exports = routers;
