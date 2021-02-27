const routers = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const createError = require("http-errors");
const { cloudinaryConfig } = require("../config/config");
const firebase = require("../config/firebase");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "/tmp/");
  },
});
const fileFilterPDF = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    return cb(null, true);
  } else {
    return cb(createError(400, "Please only upload PDF file"), false);
  }
};
const fileFilterImages = (req, file, cb) => {
  //only upload files jpg or png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    return cb(null, true);
  } else {
    return cb(createError(400, "Please only upload image jpg or png"), false);
  }
};
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilterImages,
});
const uploadPDF = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilterPDF,
});
routers.post("/images", uploadImage.single("image"), async (req, res, next) => {
  try {
    await firebase.bucket.upload(req.file.path, {
      metadata: {
        contentType: req.file.mimetype,
      },
      destination: req.file.originalname,
    });
    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      url: `https://storage.googleapis.com/${firebase.bucket.name}/${req.file.originalname}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/pdf", uploadPDF.single("doc"), async (req, res, next) => {
  try {
    await firebase.bucket.upload(req.file.path, {
      metadata: {
        contentType: req.file.mimetype,
      },
      destination: req.file.originalname,
    });
    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      url: `https://storage.googleapis.com/${firebase.bucket.name}/${req.file.originalname}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/delete/file", async (req, res, next) => {
  try {
    const fileUrls = req.body.files;
    await cloudinary.api.delete_resources(fileUrls, (err, result) => {
      if (err) return res.json({ message: err.message });
    });
    return res.status(200).json({ result: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = routers;
