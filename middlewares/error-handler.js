// middlewares/error-handler.js

//this is your centralized error handling middleware. It should be used in app.js after all routes and before the server starts listening.
module.exports = (err, req, res, next) => {
  console.error(err);

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? "An error occurred on the server"
      : message,
  });
};
