const { validateToken } = require('../authServices/create&validateToken');
const { parse } = require("cookie");
const auth = (req, res, next) => {
  try {
    let token;

    if (req.headers.cookie) {
      const parsedCookies = parse(req.headers.cookie);
      token = parsedCookies.token;
    }

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "No token found. Please login." });
    } 
      const userPayload = validateToken(token);
    if (!userPayload) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = userPayload;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(500).json({ error: "Authentication failed." });
  }
};

module.exports = auth;


