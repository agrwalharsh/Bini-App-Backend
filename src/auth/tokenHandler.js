const jwt = require("jsonwebtoken");
const secret = process.env.secret;

function verifyToken(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  module.exports = {
    verifyToken
  };
  