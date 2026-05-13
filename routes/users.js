const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    }),
  }),
  updateCurrentUser
);

module.exports = router;
