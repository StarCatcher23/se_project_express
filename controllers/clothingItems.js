const ClothingItem = require("../models/clothingItem");

// CREATE ITEM
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // If you have auth middleware, req.user._id will exist
  const owner = req.user ? req.user._id : null;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from createItem", e });
    });
};

// GET ALL ITEMS
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getItems", e });
    });
};

// UPDATE ITEM
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

// DELETE ITEM
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId); // Log the itemId to ensure it's being received correctly
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
