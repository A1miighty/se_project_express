const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors"); // Import constant
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

// ✅ Routes (each file will apply `auth` where needed)
router.use("/users", userRouter);
router.use("/items", itemRouter);

// ✅ 404 Handler using constant
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
