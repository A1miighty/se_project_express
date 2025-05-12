const ClothingItem = require("../models/clothingItems");
const { NOT_FOUND } = require("../utils/errors");

const getItems = (req, res, next) => {
  ClothingItem.find({}).then((items) => res.json(items)); // ✅ 200 is implied
};

const getItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)); // ✅ 200 is implied
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner }).then((item) =>
    res.status(201).json(item)
  ); // ✅ 201 for creation
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Clothing item not found" });
      }

      if (item.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You do not have permission to delete this item" });
      }

      return item
        .deleteOne()
        .then(() => res.json({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error", error: err.message });
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)); // ✅ 200 is implied
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.json(item)); // ✅ 200 is implied
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
