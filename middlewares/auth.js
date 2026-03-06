const jwt = require("jsonwebtoken"); // Importing the JWT library to handle JSON Web Tokens for authentication
const { JWT_SECRET } = require("../utils/config"); // Importing the JWT library and the secret key used for signing and verifying tokens

//Extracting the authorization header from the incoming request.
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  //if thee's no authorization header or it doesn't start with "Bearer ", return 401 Unauthorized
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", ""); //extracting the actual token from the header by removing the "Bearer " prefix

  let payload; //verifying the token

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Invalid token" });
  }

  req.user = payload; // now req.user._id is available, this attaches the user information to the request object for use in subsequent middleware and route handlers
  next();
};
