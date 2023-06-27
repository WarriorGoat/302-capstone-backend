const Entry = require("../models/Entries");

//Request and display all entries
const getAllEntries = async (req, res) => {
  try {
    const allEntries = await Entry.find({});
    res.json({
      success: true,
      entries: allEntries,
    });
  } catch (e) {
    console.log(`Error Point 1` + e);
  }
};

//Create a new entry
const createOneEntry = async (req, res, next) => {
  try {
    const newEntry = {
      company: req.body.company,
      author: req.body.author,
      contactFirstName: req.body.contactFirstName,
      contactLastName: req.body.contactLastName,
      contactEmail: req.body.contactEmail,
      companyAddress: {
        streetNum: req.body.streetNum,
        streetName: req.body.streetName,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
      },
      webAddress: req.body.webAddress,
      licenseInfo: {
        licenseState: req.body.licenseState,
        licenseNum: req.body.licenseNum,
        licenseClass: req.body.licenseClass,
      },
      workTypes: {
        type0: req.body.type0,
        type1: req.body.type1,
        type2: req.body.type2,
        type3: req.body.type3,
        type4: req.body.type4,
        type5: req.body.type5,
        type6: req.body.type6,
        type7: req.body.type7,
        type8: req.body.type8,
        type9: req.body.type9,
      },
      freeEstimates: req.body.freeEstimates,
      active: true
    };

    //pass fields to new Entry model and database collection
    const createOne = await Entry.create(newEntry);

    //return the successful request to the user
    res.json({
      success: true,
      entry: createOne,
    });
  } catch (e) {
    console.log(typeof e);
    console.log(e);
    res.json({
      error: e.toString(),
    });
  }
};

// This section will pull a single record, using the company name paramter.
const getOneEntry = async (req, res, next) => {
  try {
    const oneEntry = await Entry.findOne({ company: req.params.company });
    res.json({ 
      success: true,
      entry: oneEntry });
  } catch (error) {
    res.status(500).send(error);
  }
};

// This section will update a single record, using the company name paramter.
const updateOneEntry = async (req, res, next) => {
  try {
    const entryToFind = req.params.company;
    const originalEntry = await Entry.findOne({
      company: entryToFind,
    });
    if (typeof originalEntry === "undefined") {
      res.json({
        success: false,
        message: "Could not find that Company.  Please try again.",
      });
      return;
    }
    await Entry.updateOne(
      { company: entryToFind },
      {
        $inc: { __v: 1 },
        $set: 
        { company: req.body.company,
          author: req.body.author,
          contactFirstName: req.body.contactFirstName,
          contactLastName: req.body.contactLastName,
          contactEmail: req.body.contactEmail,
          companyAddress: {
            streetNum: req.body.streetNum,
            streetName: req.body.streetName,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
          },
          companyWebSite: req.body.companyWebsite,
          licenseInfo: {
            licenseState: req.body.licenseState,
            licenseNum: req.body.licenseNum,
            licenseClass: req.body.licenseClass,
          },
          workTypes: {
            type0: req.body.workType0,
            type1: req.body.workType1,
            type2: req.body.workType2,
            type3: req.body.workType3,
            type4: req.body.workType4,
            type5: req.body.workType5,
            type6: req.body.workType6,
            type7: req.body.workType7,
            type8: req.body.workType8,
            type9: req.body.workType9,
          },
          active: false,
          freeEstimates: false,
          updatedAt: new Date(),
        },
      }
    );
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      error: String(e),
    });
  }
  res.json({
    success: true,
    message: "entry updated",
  });
};

// This section will pull a multiple records, using a location paramter (state).
const getManyEntries = async (req, res, next) => {
  try {
    const manyEntries = await Entry.find({ 
      "companyAddress.state": req.params.state });
    res.json({ 
      success: true,
      entries: manyEntries });
  } catch (error) {
    res.status(500).send(error);
  }
}

// This section will delete a single record, using the company name paramter.
async function deleteOneEntry(req, res, next) {
  try {
    const oneEntry = Entry.findOneAndRemove({ company: req.params.company });
    res.json({ message: "Removed", entry: oneEntry });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  getAllEntries,
  createOneEntry,
  updateOneEntry,
  getOneEntry,
  getManyEntries,
  deleteOneEntry,
};