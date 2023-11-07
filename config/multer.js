const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const MONGO_URI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename =
        crypto.randomBytes(16).toString("hex") +
        path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: "articles",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

const storage1 = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename =
        crypto.randomBytes(16).toString("hex") +
        path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: "users",
      };
      resolve(fileInfo);
    });
  },
});

const uploadProf = multer({ storage1 });

module.exports = {
  upload,
  uploadProf
};