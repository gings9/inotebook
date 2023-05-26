const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

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
    //Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400) //TODO: replace 400 status code with Conflict Error status code
          .json({ error: "Sorry a user with this email is already exists!" });
      }
      user = await User.create({
        name: req.body.name, //to put username to the request body
        password: req.body.password, //to put password to the request body
        email: req.body.email, //to put email to the request body
      });
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
    // .then((user) => res.json(user)) //then get the json response for user
    // .catch((err) => {
    //   console.error(err);
    //   res.json({
    //     error: "Please enter a unique value for email",
    //     message: err.message,
    //   });
    //}); //console log to catch block to handle error with message in json response
  }
);

module.exports = router;
