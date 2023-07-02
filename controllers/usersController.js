const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const {
  generatePasswordHash,
  validatePassword,
  generateUserToken,
  verifyToken,
} = require("../auth");

//Request and display all users
async function getAllUsers(req, res) {
  //query blogs
  try {
    const allUsers = await User.find({});
    res.json({
      success: true,
      users: allUsers,
    });
  } catch (e) {
    console.log(`getAllUsers Error ` + e);
  }
}

//register a new user
const registration = async (req, res, next) => {
  try {
    //parse out fields from POST request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const scope = req.body.scope

    const saltRounds = 10;

    const passwordHash = await generatePasswordHash(password, saltRounds);

    //pass fields to new Blog model
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      scope: scope,
      password: passwordHash,
    });

    //save our new entry to the database
    const savedData = await newUser.save();

    //return the successful request to the user
    res.json({
      success: true,
      user: savedData,
    });
  } catch (e) {
    console.log(typeof e);
    console.log(e);
    res.json({
      error: e.toString(),
    });
  }
};

// This section will allow a registered user to log in.
const logIn = async (req, res, next) => {
  try {
    console.log("backend login request received")
    console.log (req)
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.json({ success: false, message: "Could not find user." }).status(204);
      return;
    } else {
      console.log("User Found");
      console.log (user)
    }

    const isPWValid = await validatePassword(req.body.password, user.password);
    if (!isPWValid) {
      res
        .json({ success: false, message: "Password was incorrect." })
        .status(204);
      return;
    } else {
      console.log("Password Valid");
    }

    // const userType = user.email.includes("admin.com") ? "admin" : "user";
    const data = {
      date: new Date(),
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      scope: user.scope,
    };

    const token = generateUserToken(data);
    res.json({
      success: true,
      token: token,
      email: user.email,
      scope: user.scope,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    console.log(token);
    return;
  } catch (error) {
    console.log("error on starting logIn controller")
    console.error(error);
    res.json({ success: false, message: error.toString() });
  }
};

//check token for validity
const authtoken = async (req, res) => {
  try {
    try {
      let foundUser = await User.findById(req.decoded.id);
      res.status(200).json({
        email: req.decoded.userData.email,
        firstName: req.decoded.userData.firstName,
        lastName: req.decoded.userData.lastName,
        scope: req.decoded.userData.scope,
        message: "Successful Token Login!!",
      });
    } catch (error) {
      console.log("--User Not Found");
      console.log(error);
    }
  } catch (error) {
    console.log("authtoken Failed");
    console.log(TypeError);
  }
};

//display message depending on validity and status of login credentials
const message = (req, res, next) => {
  try {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const token = req.header(tokenHeaderKey);
    // console.log("token ", token);
    const verifiedTokenPayload = verifyToken(token);

    if (!verifiedTokenPayload) {
      return res.json({
        success: false,
        message: "ID Token could not be verified",
      });
    }
    console.log("ID Token Verified");
    const userData = verifiedTokenPayload.userData;

    if (userData && userData.scope === "user") {
      return res.json({
        success: true,
        message: `I am a normal user with email: ${userData.email}`,
      });
    }

    if (userData && userData.scope === "contractor") {
      return res.json({
        success: true,
        message: `I am a contractor with email: ${userData.email}`,
      });
    }

    if (userData && userData.scope === "admin") {
      return res.json({
        success: true,
        message: `I am an admin user with email ${userData.email}`,
      });
    }
    throw Error("Access Denied");
  } catch (error) {
    // Access Denied
    return res.status(401).json({
      success: false,
      message: error,
    });
  }
};

//Update user data, except loginId & Password
const updateUser = async (req, res, next) => {
  try {
    const userEmailToFind = req.params.email;
    const originalUser = await User.findOne({
      email: userEmailToFind,
    });
    if (typeof originalUser === "undefined") {
      res.json({
        success: false,
        message: "Could not find user with that email.  Please try again.",
      });
      return;
    }
    await User.updateOne(
      { email: userEmailToFind },
      {
        $inc: { __v: 1 },
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
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
    message: "user updated",
  });
};

//Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const email = req.params.email;
    const oneUser = await User.findOneAndRemove({ email });
    res.json({
      message: "Removed",
      user: oneUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllUsers,
  registration,
  logIn,
  authtoken,
  message,
  updateUser,
  deleteUser,
};
