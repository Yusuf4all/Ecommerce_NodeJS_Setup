const jwt = require("jsonwebtoken");

module.exports = {
  async jwtSign(payload) {
    const TOKEN = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    return TOKEN;
  },

  async jwtVerify(token) {
    const DECODED = jwt.verify(token, process.env.JWT_SECRET);
    return DECODED;
  },
};
