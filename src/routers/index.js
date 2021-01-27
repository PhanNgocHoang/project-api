const routers = require("express").Router();
const authRouter = require("./auth");
const typebookRouter = require("./typebook.router");
const upload = require("./upload");
const authors = require("./author.router");
const publisher = require("./publisher.router");

routers.use("/auth", authRouter);
routers.use("/typebook", typebookRouter);
routers.use("/upload", upload);
routers.use("/author", authors);
routers.use("/publisher", publisher);
module.exports = routers;
