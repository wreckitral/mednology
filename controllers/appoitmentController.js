const Appoitment = require("../models/Appoitment");
const asyncHandler = require("express-async-handler");

const createAppoitment = asyncHandler(async (req, res) => {
  const { description, clinicAddress, date, progress } = req.body;

  if (
    !description ||
    !clinicAddress ||
    !date ||
    !progress ||
    description === "" ||
    clinicAddress === "" ||
    date === "" ||
    progress === ""
  )
    return res.status(400).json({ msg: "All fields are required" });

  const newAppoitment = new Appoitment({
    description,
    clinicAddress,
    date,
    progress,
  });

  await newAppoitment.save();

});

module.exports = {
  createAppoitment,
};
