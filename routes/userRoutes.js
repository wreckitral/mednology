const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { uploadProf } = require("../config/multer");

router.post("/signup", uploadProf.single("file"), controller.signup);
router.post("/signup-doctor", uploadProf.single("file"), controller.doctorSignup);

router.get("/verifyEmail/:emailToken", controller.verifyEmail);

module.exports = router;
