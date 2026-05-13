const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// ===== PUBLIC ROUTES =====
router.get("/", getItems);

// ===== PROTECTED ROUTES =====

// CREATE ITEM
router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().required().valid("hot", "warm", "cold"),
      imageUrl: Joi.string().required().uri(),
    }),
  }),
  createItem
);

// DELETE ITEM
router.delete(
  "/:itemId",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteItem
);

// LIKE ITEM
router.put(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeItem
);

// UNLIKE ITEM
router.delete(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  unlikeItem
);

module.exports = router;
