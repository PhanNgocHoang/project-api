const routers = require("express").Router();
const createError = require("http-errors");
const join = require("joi");
const {
  getPublishers,
  getDetailsPublisher,
  createPublisher,
  updatePublisher,
  findPublisherByName,
  deletePublisher,
  getAllPublishers,
} = require("../services/admin/admin.services.publishers");

routers.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const result = await getPublishers(page, limit, searchKey);
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.post("/createdPublisher", async (req, res, next) => {
  try {
    const publisherData = join.object({
      publisherName: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      address: join.string().required(),
    });
    const newData = await publisherData.validate(req.body);
    if (newData.error) {
      return res.status(400).json({ message: newData.error.message });
    }
    const publisher = await findPublisherByName(req.body.publisherName);
    if (publisher) {
      return res.status(400).json({ message: "Publisher is exist" });
    }
    await createPublisher(newData.value);
    return res.status(200).json({ message: "Create publisher successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});
routers.delete("/:publisherId", async (req, res, next) => {
  try {
    await deletePublisher(req.params.publisherId);
    return res.status(200).json({ message: "Delete Publisher successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.put("/:publisherId", async (req, res, next) => {
  try {
    const publisherData = join.object({
      publisherName: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      address: join.string().required(),
    });
    const newData = publisherData.validate({
      publisherName: req.body.publisherName,
      address: req.body.address,
    });
    if (newData.error) {
      return next(createError(400, newData.error.message));
    }
    await updatePublisher(req.params.publisherId, newData.value);
    return res.status(200).json({ message: "Update Publisher successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/:publisherId", async (req, res, next) => {
  try {
    const publisher = await getDetailsPublisher(req.params.publisherId);
    return res.status(200).json({ data: publisher });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/getAll", async (req, res, next) => {
  try {
    const publishers = await getAllPublishers();
    return res.status(200).json({ data: publishers });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});
module.exports = routers;
