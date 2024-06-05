const { join } = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 2000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", express.static(__dirname + "/public"));

//#region API ROUTES
const userRouter = require("./src/routers/userRouter");
const eventRouter = require("./src/routers/eventRouter");
// ===========================
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);

// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

// greeting
app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, User !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err);
    res.status(500).send(err);
  } else {
    next();
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
