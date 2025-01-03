const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const express = require("express");
const app = express();
const postsRoute = require("./routes/posts_route");
const commentsRoute = require("./routes/comments_route")
const usersRoute = require("./routes/users_route");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute)
app.use("/users", usersRoute);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB_CONNECT)
      .then(() => {
        resolve(app);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = initApp;