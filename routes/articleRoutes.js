const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");
const articleController = require("../controllers/articleController");
const authenticate = require("../middlewares/authenticate");

router.post("/upload", authenticate, upload.array("files"), articleController.createArticle);

module.exports = router;