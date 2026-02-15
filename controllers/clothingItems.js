const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require("../utils/errors");

// CREATE ITEM
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid data",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "An error has occurred on the server",
      });
    });
};

// GET ALL ITEMS
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "Internal server error",
      });
    });
};

// DELETE ITEM
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      return res.status(200).send({
        message: "Item deleted successfully",
        data: item,
      });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid item ID format",
        });
      }

      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Item not found",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "Error from deleteItem",
      });
    });
};

// LIKE ITEM
const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      return res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid item ID format",
        });
      }

      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Item not found",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "Error from likeItem",
      });
    });
};

// UNLIKE ITEM
const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      return res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid item ID format",
        });
      }

      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Item not found",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "Error from unlikeItem",
      });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
