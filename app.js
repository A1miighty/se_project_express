const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

const cors = require("cors");

app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection lost:", err)
);

app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: "67ea979672b7caf11a0392f3",
//   };
//   next();
// });

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
