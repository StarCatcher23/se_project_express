const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("DB error", e);
  });

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: "6983e768f53ad18c6d118846", // paste the _id of the test user created in the previous step
  };
  next();
});

// 404 handler — must be BEFORE app.listen()
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("This is working");
});
