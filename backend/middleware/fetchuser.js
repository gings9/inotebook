var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harryisagood$boy"; //TODO: put this in environment variable

const fetchuser = (req, res, next) => {
  //Get the user from the jwt token and add id to the request object
  const token = req.header("auth-token"); //get the token header and named as auth-token
  //Check if token is not available
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  //if token is available, try to retrieve token & JWT Secret to verify & call next function
  //which will be async function in auth.js where Login is required
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
