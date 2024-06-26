const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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

const User = mongoose.model("User", userSchema);

module.exports = User;
