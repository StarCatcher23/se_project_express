const ClothingItem = require("../models/clothingItem");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");



// CREATE ITEM
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

// GET ALL ITEMS
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(next);
};

// DELETE ITEM
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You cannot delete another user's item");
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({
          message: "Item deleted successfully",
          data: item,
        });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(err);
    });
};

// LIKE ITEM
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(e);
    });
};

// UNLIKE ITEM
const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(e);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
