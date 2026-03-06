const router = require("express").Router();

const { getItems } = require("../controllers/clothingItems");

// READ - List all items (public endpoint)
router.get("/", getItems);

// --- Export the router to be used in app.js ---
module.exports = router;
