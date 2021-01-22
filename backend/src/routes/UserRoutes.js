const express = require("express");

const UserController = require("../app/controllers/UserController");
const BalanceController = require("../app/controllers/BalanceController");
const TransferController = require("../app/controllers/TransferController");

const Authentication = require("../app/middlewares/Authentication");

const UserRoutes = express.Router();

UserRoutes.use(Authentication.token);

UserRoutes.get("/users", UserController.listAllUsers);
UserRoutes.get("/users/:id", UserController.findUserById);
UserRoutes.put("/users", UserController.updateUserById);
UserRoutes.delete("/users/:id", UserController.deleteUserById);

UserRoutes.get("/balances/:id", BalanceController.findBalanceByUserId);
UserRoutes.put("/balances/:id", BalanceController.updateBalanceById);
//UserRoutes.get("/balances/set/:id", BalanceController.balanceSetByUserId);
//UserRoutes.get("/balances/add/:id", BalanceController.balanceAddByUserId);
//UserRoutes.get("/balances/remove/:id", BalanceController.balanceRemoveByUserId);

UserRoutes.get("/transfers/:id", TransferController.transferHistoryById);
UserRoutes.post("/transfer", TransferController.transferToUser);

module.exports = UserRoutes;