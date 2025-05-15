const ClothingItem = require("../models/clothingItems");
const {
  BAD_REQUEST,
  SERVER_ERROR,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.json(items)) // ✅ 200 is implied
    .catch(() => {
      res.status(SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

const getItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)) // ✅ 200 is implied
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item)) // ✅ 201 for creation
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid input data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND)
          .json({ message: "Clothing item not found" });
      }

      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN)
          .json({ message: "You do not have permission to delete this item" });
      }

      return item
        .deleteOne()
        .then(() => res.json({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // Prevents duplicates
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)) // ✅ 200 is implied
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Removes user's like
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)) // ✅ 200 is implied
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
