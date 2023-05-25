const connectToMongo = require("./db");
const express = require("express");

connectToMongo();

const app = express();
const port = 3000;

//Available Routes
app.use("/api/auth", require("./routes/auth")); // API request for authentication of users
app.use("/api/notes", require("./routes/notes")); // API request for notes generation

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
