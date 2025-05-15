const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // example fixed user id
  };
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(() => {});

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
});

mongoose.connection.on("error", () => {
  console.error("MongoDB connection lost");
});

app.use(express.json());
app.use("/", mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
