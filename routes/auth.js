const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");

// POST - User login
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// POST - User registration
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

module.exports = router;
