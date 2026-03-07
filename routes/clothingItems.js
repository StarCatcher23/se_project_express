const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// ===== PUBLIC ROUTES =====
// READ - List all items (public endpoint)
router.get("/", getItems);

// ===== PROTECTED ROUTES =====
// All routes below require authentication

// CREATE - Add a new item to the collection with the provided details, associating it with the authenticated user as the owner
router.post("/", auth, createItem);

// DELETE - Remove an item by its ID, ensuring that only the owner of the item can delete it
router.delete("/:itemId", auth, deleteItem);

// LIKE - Add a like to an item by its ID, allowing users to like items they find interesting or useful
router.put("/:itemId/likes", auth, likeItem);

// UNLIKE - Remove a like from an item by its ID, allowing users to unlike items they have previously liked
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
