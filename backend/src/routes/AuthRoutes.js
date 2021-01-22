const express = require("express");

const AuthController = require("../app/controllers/AuthController");
const Authentication = require("../app/middlewares/Authentication");

const AuthRoutes = express.Router();

AuthRoutes.post("/auth/register", AuthController.createUser);
AuthRoutes.post("/auth/login", AuthController.loginUser);
AuthRoutes.get("/auth/session", Authentication.token, AuthController.sessionUser);
AuthRoutes.get("/auth/logout", Authentication.token, AuthController.logoutUser);

module.exports = AuthRoutes;