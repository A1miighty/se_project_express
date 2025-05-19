const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth); // protect routes below

router.use("/users", userRouter);
router.use("/items", itemRouter);

// Catch-all for 404
router.use("*", (req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
