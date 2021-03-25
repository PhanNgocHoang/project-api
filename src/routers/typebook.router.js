const routers = require("express").Router();
const join = require("joi");
const {
  createTypeBook,
  typesBook,
  getTypeBookDetail,
  getBookTypebook,
  updateTypeBook,
  deleteTypeBook,
  findTypeBookByTypeName,
  getAllBookTypes,
} = require("../services/admin/admin.services.typebook");
const { authMiddleware, authAdmin } = require("../middlewares/auth");

routers.get(
  "/getAll",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const bookTypes = await getAllBookTypes();
      return res.status(200).json({ data: bookTypes });
    } catch (error) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
);
routers.post(
  "/createtypebook",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const typeBookData = join.object({
        type_name: join
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
          .required(),
      });
      const newData = await typeBookData.validate(req.body);
      if (newData.error) {
        newData.error.message = "Invalid type name";
        return res.status(400).json({ message: newData.error.message });
      }
      const typeBook = await findTypeBookByTypeName(req.body.type_name);
      if (typeBook) {
        return res.status(400).json({ message: "Book type is exist" });
      }
      await createTypeBook(newData.value);
      return res.status(200).json({ message: "Create type book successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
routers.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const result = await typesBook(page, limit, searchKey);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get(
  "/:typebookId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const typebook = await getTypeBookDetail(req.params.typebookId);
      return res.status(200).json({ data: typebook });
    } catch (error) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
);
routers.get("/books/:typebookId", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const typebook = await getBookTypebook(req.params.typebookId, page);
    return res.status(200).json({ data: typebook });
  } catch (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
});
routers.put(
  "/:typebookId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const typebook = join.object({
        type_name: join
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
          .required(),
      });

      const typebookValidate = await typebook.validate({
        type_name: req.body.type_name,
      });
      if (typebookValidate.error) {
        typebookValidate.error.message = "Invalid type name";
        return res
          .status(400)
          .json({ message: typebookValidate.error.message });
      }
      await updateTypeBook(req.params.typebookId, typebookValidate.value);
      return res.status(200).json({ message: "Update type book successfully" });
    } catch (error) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
);
routers.delete(
  "/:typebookId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      await deleteTypeBook(req.params.typebookId);
      return res.status(200).json({ message: "Delete type book successfully" });
    } catch (error) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
);

module.exports = routers;
