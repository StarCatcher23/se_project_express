const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  CONFLICT,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user ID format" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /users
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  // 1. Early validation for required fields
  if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({
      message: "Email and password are required",
    });
  }

  try {
    // 2. Safe to hash now
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user with Mongoose validation
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    // 4. Remove password before sending response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).send(userObj);
  } catch (err) {
    console.log(err);

    // Duplicate email
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Invalid data",
      });
    }

    // 5. Unexpected errors → JSON 500
    return res.status(INTERNAL_SERVER_ERROR_CODE).send({
      message: "An error has occurred on the server",
    });
  }
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  // If email or password is missing → 400 Bad Request
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(UNAUTHORIZED_ERROR_CODE)
        .send({ message: "Incorrect email or password" });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
