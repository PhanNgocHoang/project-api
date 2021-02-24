const routers = require("express").Router();
const authRouter = require("./auth");
const typebookRouter = require("./typebook.router");
const upload = require("./upload");
const authors = require("./author.router");
const publisher = require("./publisher.router");
const books = require("./books.router");
const review = require("./review.router");

routers.use("/auth", authRouter);
routers.use("/typebook", typebookRouter);
routers.use("/upload", upload);
routers.use("/author", authors);
routers.use("/publisher", publisher);
routers.use("/books", books);
routers.use("/review", review);
module.exports = routers;
