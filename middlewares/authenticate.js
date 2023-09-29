const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed" });
  }
};

module.exports = authenticate;