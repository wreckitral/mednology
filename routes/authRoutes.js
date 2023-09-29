const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/refresh", controller.refresh);

module.exports = router;
