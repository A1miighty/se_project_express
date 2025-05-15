const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(() => {
  // Optional: handle initial connection error
});

mongoose.connection.on("connected", () => {
  // eslint-disable-next-line no-console
  console.log("Connected to DB");
});

mongoose.connection.on("error", () => {
  // eslint-disable-next-line no-console
  console.error("MongoDB connection lost");
});

app.use(express.json());
app.use("/", mainRouter);

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
