const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Middleware
app.use(cors());
app.use(express.json());

// 🧪 Set test user for project tests (stub user)
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// Routes
app.use("/", mainRouter);

// Handle celebrate validation errors
app.use(errors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 👇 Necessary for tests
module.exports = app;
