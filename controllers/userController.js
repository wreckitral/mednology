const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");

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
    return res.status(400).json({ msg: "All fields are required" }); // checking if the user provide all of the credentials

  const existUsername = await User.findOne({ username: username }); // checking if the user already exist 
  const existEmail = await User.findOne({ email: email });

  if (existUsername)
    return res.status(409).json({ msg: "Username already exist" }); // return if they already exist
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

  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({ 
    theme: "cerberus",
    product: {
      name: "MEDNOLOGY",
      link: "https://google.com",
    },
  });

  const emailToken = jwt.sign( // create token to send in order to send email verification to user 
    { userId: newUser._id },
    process.env.EMAIL_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const emailToSent = { 
    body: {
      name: `${firstName} ${lastName}`,
      intro: "Terima kasih Anda telah bergabung dengan mednology.com",
      action: {
        instructions:
          "Silahkan klik link di bawah ini untuk mengkonfirmasi email Anda",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your email",
          link: `http://localhost:7777/user/verifyEmail/${emailToken}`,
        },
      },
      outro:
        "Punya pertanyaan? Silahkan balas email ini, dengan senang hati kami akan menjawab",
      signature: "Terima Kasih",
      greeting: "Halo",
    },
  };

  const emailBody = MailGenerator.generate(emailToSent); // generate the email using Mailgen package

  const message = {
    from: process.env.EMAIL,
    to: newUser.email,
    subject: "Konfirmasi Email",
    html: emailBody,
  };

  transporter.sendMail(message).then(() => { // sending the email using nodemailer 
    return res.status(201).json({
      msg: "User successfully registered, user should receive verification email",
    });
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId } = jwt.verify(
    req.params.emailToken,
    process.env.EMAIL_SECRET
  ); // fetching the userId from the decoded token

  await User.updateOne({ _id: userId }, { isConfirmed: true }); // updating the isConfirmed field on database

  return res
    .status(200)
    .json({ msg: "Email is verified, you can redirect to login page" });
});

module.exports = {
  signup,
  verifyEmail,
};
