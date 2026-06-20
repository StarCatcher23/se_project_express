const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const { JWT_SECRET } = require("../utils/config");

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

// POST /users
const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // 1. Early validation for required fields
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
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
    console.warn(err);

    // Duplicate email
    if (err.code === 11000) {
      return next(new BadRequestError("A user with this email already exists"));
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }

    // 5. Unexpected errors → forward to error middleware
    return next(err);
  }
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  // If email or password is missing → 400 Bad Request
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
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
      return next(new UnauthorizedError("Incorrect email or password"));
    });
};

const updateCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.warn(err);

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
