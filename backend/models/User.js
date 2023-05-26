const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  //schema fields are: name, email, password, date
  //type is String and required fields are true so we cannot keep empty
  //date would be default as current date
  //email would be unique
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const user = mongoose.model("User", UserSchema);
module.exports = user;
