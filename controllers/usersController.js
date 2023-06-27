const User = require("../models/Users");

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
    console.log(`Error Point 1` + e);
  }
}

//register a new user
const registration = async (req, res, next) => {
  try {
    //parse out fields from POST request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const loginId = req.body.loginId;
    const password = req.body.password;

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10.  Higher number is more secure, but requires more processing time.

    const passwordHash = await generatePasswordHash(password, saltRounds);

    //pass fields to new Blog model
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      loginId: loginId,
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
    const loginId = req.body.loginId;
    const password = req.body.password;

    const user = await User.findOne({ loginId });

    if (!user) {
      res.json({ success: false, message: "Could not find user." }).status(204);
      return;
    } else {
      console.log("User Found");
    }

    const isPWValid = await validatePassword(password, user.password);
    if (!isPWValid) {
      res
        .json({ success: false, message: "Password was incorrect." })
        .status(204);
      return;
    } else {
      console.log("Password Valid");
    }

    const userType = user.email.includes("admin.com") ? "admin" : "user";
    const data = {
      date: new Date(),
      loginId: user.loginId,
      scope: userType,
      email: user.email,
    };
    // console.log(data);

    const token = generateUserToken(data);
    res.json({ success: true, token });
    console.log(token)
    return;
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.toString() });
  }
};

//display message depending on validity and status of login credentials
const message = (req, res, next) => {
  // console.log(req)
  try {
    
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const token = req.header(tokenHeaderKey);
    console.log("token ", token);
    const verifiedTokenPayload = verifyToken(token);

    if (!verifiedTokenPayload) {
      return res.json({
        success: false,
        message: "ID Token could not be verified",
      });
    }

    // console.log(verifiedTokenPayload);
    const userData = verifiedTokenPayload.userData;

    if (userData && userData.scope === "user") {
      return res.json({
        success: true,
        message: `I am a normal user with login Id ${userData.loginId} and email: ${userData.email}`,
      });
    }

    if (userData && userData.scope === "admin") {
      return res.json({
        success: true,
        message: `I am an admin user with login Id ${userData.loginId} and email ${userData.email}`,
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
    const userIdToFind = req.params.loginId;
    const originalUser = await User.findOne({
      loginId: userIdToFind,
    });
    if (typeof originalUser === "undefined") {
      res.json({
        success: false,
        message: "Could not find user with that login ID.  Please try again.",
      });
      return;
    }
    await User.updateOne(
      { loginId: userIdToFind },
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
    const loginId = req.params.loginId;
    const oneUser = await User.findOneAndRemove({ loginId });
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
  message,
  updateUser,
  deleteUser,
};