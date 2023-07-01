const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken) {
      const token = bearerToken.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SUPER_SECRET_KEY);

      // jwt.verify will check for expiration, code
      req.decoded = decoded;
      // req / request object gets passed with the next callback function
      next();
    } else {
      console.log("--Missing Token--");
      throw {
        status: 401,
        message: "Missing Token",
      };
    }
  } catch (error) {
    console.log("--verifyToken Error--");
    res.status(error.status || 401).json(error.message);
  }
};

module.exports = { verifyToken };
