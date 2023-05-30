const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ENDPOINT(4): Route-1
//Get all the Notes using : GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ENDPOINT(5): Route-2
//Create a Note using : POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body; //De-Structuring of req.body
      //if there are errors, return bad request and the errors
      const errors = validationResult(req);
      //if errors are not empty means we have errors
      if (!errors.isEmpty()) {
        //then return response with an error array (if multiple errors)
        //with 400 Bad Request Status Code
        return res.status(400).json({ errors: errors.array() });
      }
      //add note title, description, tag, user_ID & auto-date to the note variable
      const note = new Note({ title, description, tag, user: req.user.id });
      //call await save method to save the notes details
      const savedNote = await note.save();
      //call json response with savedNotes as a reply
      res.json(savedNote);
    } catch (error) {
      //log error message to console & response API
      //as Internal Server Error if an invalid error occurred.
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ENDPOINT(6): Route-3
//Update an existing Note using : PUT "/api/notes/updatenote/:id". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body; //de-structuring the request body
    //  Create a  newNote object to receive either or Title, Description or a Tag
    const newNote = {};
    //take either title/description/tag as a input and put in above newNote variable
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id); //will take id from endpoint /:id (id from parameter)
    //check if the note is exist or not
    if (!note) {
      return res.status(404).send("Page not found");
    }
    //check if user is the same or not --> will match user string with the request id from body request user id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("UnAuthorized");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    //log error message to console & response API
    //as Internal Server Error if an invalid error occurred.
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ENDPOINT(7): Route-4
//Delete an existing Note using : PUT "/api/notes/deletenote/:id". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id); //will take id from endpoint /:id (id from parameter)
    //check if the note is exist or not
    if (!note) {
      return res.status(404).send("Page not found");
    }
    //check if user is the same or not --> will match user string with the request id from body request user id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("UnAuthorized");
    }
    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    //log error message to console & response API
    //as Internal Server Error if an invalid error occurred.
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
