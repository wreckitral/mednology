// package import
require("dotenv").config();
console.log(process.env.NODE_ENV);
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// import config
const corsOptions = require("./config/corsConfig");

// import middlewares
const errorHandler = require("./middlewares/errorHandler");

// import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// call express as app
const app = express();

// use all middlewares
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(corsOptions));

// use the routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(errorHandler); // catching all of the error

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Mongodb");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
