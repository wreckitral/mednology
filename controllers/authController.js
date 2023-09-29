const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password || password === "")
    return res.status(400).json({ msg: "All fields are required" });

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ msg: "User is not signed up yet" });

  //   if (!user.isConfirmed || user.isConfirmed === "false")
  //     return res.status(400).json({ msg: "Email is not verified" });

  const isPassMatch = await bcrypt.compare(password, user.password);

  if (!isPassMatch) return res.status(400).json({ msg: "Invalid Credentials" });

  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "10s" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json({ msg: "Login Successful", username: user.username, accessToken });
});

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          userId: foundUser._id,
          username: foundUser.username,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ msg: "Access token is refreshed", accessToken });
    })
  );
};

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

module.exports = {
  login,
  refresh,
  logout
};
