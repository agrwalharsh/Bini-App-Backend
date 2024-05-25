const jwt = require("jsonwebtoken");

function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function generateToken(userId, expiresIn = '1h') {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
  return token;
};

module.exports = {
  verifyToken, generateToken
};
