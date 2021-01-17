const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, res, next) => {
  // Get Token From Header
  const token = req.header("x-auth-token");
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }
  // verify token
  try {
    const decodeToken = jwt.verify(token, config.get("data.jwtSecret"));
    req.user = decodeToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: `Invalid Token ${error}` });
  }
};

module.exports = auth;
