const mongoose = require("mongoose");
const validator = require("validator");

// ClothingItem schema definition
const clothingItemSchema = new mongoose.Schema({
  // Defining the schema for clothing items, including fields for name, weather, imageUrl, owner, likes, and createdAt
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
      // Validating that the imageUrl field contains a valid URL using the validator library, and providing a custom error message if the validation fails
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not a valid URL",
    },
  },

  // REQUIRED: owner of the item
  owner: {
    type: mongoose.Schema.Types.ObjectId, // The owner field is a reference to the User model, indicating which user created the item. It is required for each clothing item.
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
