//import mongoose library
const mongoose = require ("mongoose");
const {v4: uuidv4} = require("uuid");

//Create a blogSchema
const entrySchema = new mongoose.Schema({
  company: String,
  author: String, 
  contactFirstName: String,
  contactLastName: String,
  contactEmail: String,
  webAddress: String,
  companyAddress: {
    streetNum: Number,
    streetName: String,
    city: String,
    state: String,
    zipCode: Number
  },
  licenseInfo: {
    licenseState: String,
    licenseNum: String,
    licenseClass: String
  },
  workTypes: {
    type0: String,
    type1: String,
    type2: String,
    type3: String,
    type4: String,
    type5: String,
    type6: String,
    type7: String,
    type8: String,
    type9: String    
},
  active: Boolean,
  freeEstimates: Boolean,
  id: {type: String, default: ()=>uuidv4()},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  updatedBy: String
});



//Register the model and make it available to other files
module.exports = Entries = mongoose.model("Entries", entrySchema);