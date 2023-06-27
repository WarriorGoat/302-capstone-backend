//import mongoose library
const mongoose = require ("mongoose");
const {v4: uuidv4} = require("uuid");

//Create a userSchema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  // loginId: String,
  password: String,
  // scope: String,
  id: {type: String, 
    default: ()=>uuidv4()},
  createdAt: {type: Date, 
    default: Date.now},
  updatedAt: {type: Date, 
    default: Date.now},
});



//Register the model and make it available to other files and define the database collection
module.exports = Users = mongoose.model("Users", userSchema);