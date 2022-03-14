const express = require("express");
const ROUTE = express.Router();
const authorize = require("../services/authorization");
const ROLES = require("../services/roles");
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

ROUTE.post("/signup", signup);
ROUTE.put("/verify-email/:Email", verifyEmail);
ROUTE.post("/login", login);
ROUTE.post("/forgot-password", forgotPassword);
ROUTE.put("/reset-password/:accessToken", resetPassword);

module.exports = ROUTE;
