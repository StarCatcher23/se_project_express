const router = require("express").Router();

const {
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// CREATE - Add a new item to the collection with the provided details, associating it with the authenticated user as the owner
router.post("/", createItem);

// DELETE - Remove an item by its ID, ensuring that only the owner of the item can delete it
router.delete("/:itemId", deleteItem);

// LIKE - Add a like to an item by its ID, allowing users to like items they find interesting or useful
router.put("/:itemId/likes", likeItem);

// UNLIKE - Remove a like from an item by its ID, allowing users to unlike items they have previously liked
router.delete("/:itemId/likes", unlikeItem);

// --- Export the router to be used in app.js ---
module.exports = router;
