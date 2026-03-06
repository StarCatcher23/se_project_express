const ClothingItem = require("../models/clothingItem"); // Importing the ClothingItem model to interact with the clothing items collection in the database

const {
  // Importing error codes from a utility file to standardize error responses
  BAD_REQUEST_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors"); // Importing error codes from a utility file to standardize error responses

// CREATE ITEM
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item }); // Sending a 201 Created response with the newly created item data
    })
    .catch((err) => {
      console.error(err); //

      if (err.name === "ValidationError") {
        // If the error is a validation error, send a 400 Bad Request response with an appropriate message
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid data",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        // For any other errors, send a 500 Internal Server Error response with a generic message
        message: "An error has occurred on the server",
      });
    });
};

// GET ALL ITEMS
const getItems = (req, res) => {
  // Fetching all clothing items from the database and sending them in the response
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items }); // Sending a 200 OK response with the array of clothing items
    })
    .catch((err) => {
      // If there's an error while fetching items, log the error and send a 500 Internal Server Error response with a generic message
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "Internal server error",
      });
    });
};

// DELETE ITEM
const deleteItem = (req, res) => {
  // Deleting a clothing item by its ID, with an ownership check to ensure only the owner can delete their item
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        // If the item is not found, send a 404 Not Found response with an appropriate message
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }

      // ⭐ Ownership check// If the item exists, check if the requesting user is the owner of the item. If not, send a 403 Forbidden response
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN_ERROR_CODE)
          .send({ message: "You cannot delete another user's item" });
      }

      // ⭐ User is owner → delete// If the user is the owner, proceed to delete the item and send a 200 OK response with a success message and the deleted item data
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({
          message: "Item deleted successfully",
          data: item,
        });
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        // If the error is a CastError (invalid item ID format), send a 400 Bad Request response with an appropriate message
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }

      return res // For any other errors, send a 500 Internal Server Error response with a generic message
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// LIKE ITEM // Adding the user's ID to the likes array of the specified item, ensuring that the same user cannot like the same item multiple times
const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    // Using $addToSet to add the user's ID to the likes array only if it is not already present, preventing duplicate likes
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail() // If the item is not found, orFail() will throw an error that we can catch to send a 404 Not Found response
    .then((item) => {
      return res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "CastError") {
        // If the error is a CastError (invalid item ID format), send a 400 Bad Request response with an appropriate message
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Invalid item ID format",
        });
      }

      if (e.name === "DocumentNotFoundError") {
        // If the error is a DocumentNotFoundError (item not found), send a 404 Not Found response with an appropriate message
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: "Item not found",
        });
      }

      return res.status(INTERNAL_SERVER_ERROR_CODE).send({
        // For any other errors, send a 500 Internal Server Error response with a generic message
        message: "Error from likeItem",
      });
    });
};

// UNLIKE ITEM // Removing the user's ID from the likes array of the specified item, allowing users to unlike items they have previously liked
const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    // Using $pull to remove the user's ID from the likes array if it exists, allowing users to unlike items they have previously liked
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
