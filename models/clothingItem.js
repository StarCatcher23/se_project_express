const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },

  imageUrl: {
    type: String,
    required: [true, "The imageUrl field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not a valid URL",
    },
  },

  // REQUIRED: owner of the item
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  // REQUIRED: list of users who liked the item
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],

  // REQUIRED: creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
