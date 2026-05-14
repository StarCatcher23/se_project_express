const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateIdParam,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// PUBLIC
router.get("/", getItems);

// PROTECTED
router.post("/", auth, validateCreateItem, createItem);
router.delete("/:itemId", auth, validateIdParam, deleteItem);
router.put("/:itemId/likes", auth, validateIdParam, likeItem);
router.delete("/:itemId/likes", auth, validateIdParam, unlikeItem);

module.exports = router;
