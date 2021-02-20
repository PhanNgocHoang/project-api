const routers = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const createError = require("http-errors");
const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../config/config");

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

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
    const imageUrls = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "images" },
      (err, result) => {
        if (err) throw new Error(err);
        return result;
      }
    );
    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      image: { url: imageUrls.url, cloudinary_id: imageUrls.public_id },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/pdf", uploadPDF.single("doc"), async (req, res, next) => {
  try {
    const documentUrls = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "document" },
      (err, result) => {
        if (err) throw new Error(err);
        return result;
      }
    );
    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      url: documentUrls.url,
      cloudinary_id: documentUrls.public_id,
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
