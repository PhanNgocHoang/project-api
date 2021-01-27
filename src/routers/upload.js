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
    return cb(createError(400, "Please only upload images jpg or png"), false);
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
routers.post(
  "/images",
  uploadImage.array("images", 10),
  async (req, res, next) => {
    try {
      let images = [];
      for (const image of req.files) {
        const imageUrls = await cloudinary.uploader.upload(
          image.path,
          { folder: "images" },
          (err, result) => {
            if (err) throw new Error(err);
            return result;
          }
        );
        images.push(imageUrls.url);
        fs.unlinkSync(image.path);
      }
      return res.status(200).json({ images: images });
    } catch (error) {
      next(error);
    }
  }
);
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
    return res.status(200).json({ documentUrls: documentUrls.url });
  } catch (error) {
    next(createError(500, error));
  }
});
module.exports = routers;
