const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    firstName === "" ||
    lastName === "" ||
    username === "" ||
    email === "" ||
    password === ""
  )
    return res.status(400).json({ msg: "All fields are required" });

  const existUsername = await User.findOne({ username: username });
  const existEmail = await User.findOne({ email: email });

  if (existUsername)
    return res.status(409).json({ msg: "Username already exist" });
  if (existEmail)
    return res.status(409).json({ msg: "Email already registered" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return res.status(201).json({ msg: "User successfully registered" });
});

module.exports = {
    signup
}