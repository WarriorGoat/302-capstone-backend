//Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

//Define the database URL to connect to.
const mongoDB = process.env.MONGO_URI;

//Connecting to mongoose.
const mongooseConnect = async() => {
  try {
    (await mongoose.connect(mongoDB, { dbName: process.env.MONGO_DB }));
    console.log("MongoDB Builder-Rolodex database Connected through Mongoose");
    // await mongoose.connect(mongoDB, { dbName: process.env.MONGO_DB }).Collection(mongoDB, { dbName: process.env.MONGO_COLLECTION2 });
    // console.log("MongoDB Michigan databse Connected through Mongoose");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {mongooseConnect}