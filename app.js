const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const User = require("./models/user"); // ✅ Make sure this path is correct

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

// ✅ Set test user before any routes
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");

    // ✅ Ensure the test user exists
    User.findById("5d8b8592978f8bd833ca8133")
      .then((user) => {
        if (!user) {
          return User.create({
            _id: "5d8b8592978f8bd833ca8133",
            name: "Test User",
            email: "test@example.com", // or required fields from your schema
            avatar: "https://example.com/avatar.png", // add any other required fields
          });
        }
        return user;
      })
      .then(() => {
        console.log("Test user is ready.");
      })
      .catch((err) => {
        console.error("Failed to ensure test user:", err);
      });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Use routes AFTER setting req.user
app.use("/", mainRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
