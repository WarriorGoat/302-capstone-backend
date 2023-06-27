const express = require("express");
const userRoutes = express.Router();
// const { v4: uuidv4 } = require("uuid");
const usersController = require("../controllers/usersController");
// uuidv4();


/* GET users listing. */
userRoutes.get("/all", usersController.getAllUsers);

//Register a new user with POST
userRoutes.post("/registration", usersController.registration);

//login a registered user
userRoutes.post("/login", usersController.logIn);

//update an existing user
userRoutes.patch("/update-user/:loginId", usersController.updateUser);

//display message depending on validity and status of login credentials
userRoutes.get("/message", usersController.message);

//delete an existing user account
userRoutes.delete("/delete/:loginId", usersController.deleteUser);

module.exports = userRoutes;