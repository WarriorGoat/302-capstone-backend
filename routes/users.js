const express = require("express");
const userRoutes = express.Router();
const usersController = require("../controllers/usersController");
const { verifyToken } = require("../middleware/authorization");

/* GET users listing. */
userRoutes.get("/all", usersController.getAllUsers);

//Register a new user with POST
userRoutes.post("/registration", usersController.registration);

//login a registered user
userRoutes.post("/login", usersController.logIn);

//route for token auth
userRoutes.post("/authtoken", verifyToken, usersController.authtoken);

//update an existing user
userRoutes.patch("/update-user/:email", usersController.updateUser);

//display message depending on validity and status of login credentials
userRoutes.get("/message", usersController.message);

//delete an existing user account
userRoutes.delete("/delete/:email", verifyToken, usersController.deleteUser);

module.exports = userRoutes;
