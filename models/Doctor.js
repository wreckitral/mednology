const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  workplace: {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    kecamatan: {
      type: String,
      required: true,
    },
  },
  username: {
    type: String,
    required: [true, "Username not available"],
    unique: [true, "Username Exist"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePic: {
    filename: String,
    contentType: String,
    metadata: String,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
