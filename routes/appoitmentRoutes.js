const express = require("express");
const router = express.Router();

router.post("/create");

router.get("/confirm-appoitment")

router.get("/appoitments");

router.patch("/edit/:appoitmentId");

router.delete("/delete/:appoitmentId");

module.exports = router;