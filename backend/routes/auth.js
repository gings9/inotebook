const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Harryisagood$boy";

//ENDPOINT: 1
//Create a  User using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    //if errors are not empty means we have errors
    if (!errors.isEmpty()) {
      //then return response with an error array (if multiple errors)
      //with 400 Bad Request Status Code
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(409)
          .json({ error: "Sorry a user with this email is already exists!" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name, //to put username to the request body
        password: secPass, //to put secure password with salt to the request body
        email: req.body.email, //to put email to the request body
      });
      //generate auth token for the create user response
      const data = {
        user: {
          id: user.id, //taking user id from database
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); //payload + signature
      // console.log(jwtData);
      // res.json(user);  //no need to send user now
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ENDPOINT: 2
//Authenticate a  User using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    //if errors are not empty means we have errors
    if (!errors.isEmpty()) {
      //then return response with an error array (if multiple errors)
      //with 400 Bad Request Status Code
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //Check whether the user with this email exists already
      let user = await User.findOne({ email });
      if (!user) {
        //if user is not found return with 401: Unauthorized
        return res
          .status(401)
          .json({ error: "Please enter correct UserId & password" });
      }
      //check whether the password hash is matching with the database password hash
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(401)
          .json({ error: "Please enter correct UserId & password" });
      }
      //generate auth token for the login response
      const data = {
        user: {
          id: user.id, //taking user id from database
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); //payload + signature
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
