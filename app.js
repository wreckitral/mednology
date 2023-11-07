// package import
require("dotenv").config();
console.log(process.env.NODE_ENV);
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Grid = require("gridfs-stream");

// import config
const corsOptions = require("./config/corsConfig");

// import middlewares
const errorHandler = require("./middlewares/errorHandler");

// import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");

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

// config

const conn = mongoose.connection;

let gfs;
let gfs1;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("articles");
  gfs1 = Grid(conn.db, mongoose.mongo);
  gfs1.collection("users");
});

app.get("/article/all", async (req, res) => {
  const backgroundPhoto = await gfs.files.find().toArray();
  return res.status(200).json(backgroundPhoto);
});

// use the routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/article", articleRoutes);

app.use(errorHandler); // catching all of the error

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongodb");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
