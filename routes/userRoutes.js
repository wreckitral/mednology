const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/signup", controller.signup);

router.get("/verifyEmail/:emailToken", controller.verifyEmail);

module.exports = router;