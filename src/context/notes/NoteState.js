import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get/fetch all Notes:
  const getNotes = async () => {
    // API Call:
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET", //as we are using to get all notes from back-end
      headers: {
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3MTQ1ZGQ1MTk2MWI2NzlhNWNlMDQ0In0sImlhdCI6MTY4NTE0OTA1MH0.vK3qah28MWhWk7mq-zjxDBOQTSK-BaARWcwg3rnCQo8",
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    // API Call:
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", //as we are using POST to edit the note in back-end
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3MTQ1ZGQ1MTk2MWI2NzlhNWNlMDQ0In0sImlhdCI6MTY4NTE0OTA1MH0.vK3qah28MWhWk7mq-zjxDBOQTSK-BaARWcwg3rnCQo8",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    //Logic to Add the note
    console.log("Adding a new note");
    const note = {
      _id: "61322f119553781a8ca8d0e08",
      user: "6131dc5e3e4037cd4734a0664",
      title: title,
      description: description,
      tag: tag,
      date: "2021-09-03T14:20:09.668Z",
      __v: 0,
    };
    setNotes(notes.concat(note));
  };

  // Delete a Note
  const deleteNote = async (id) => {
    //API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE", //as we are deleting the Note
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3MTQ1ZGQ1MTk2MWI2NzlhNWNlMDQ0In0sImlhdCI6MTY4NTE0OTA1MH0.vK3qah28MWhWk7mq-zjxDBOQTSK-BaARWcwg3rnCQo8",
      },
    });
    const json = await response.json();
    console.log(json);

    //Logic to delete a note
    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call:
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", //as we are using POST to edit the note in back-end
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3MTQ1ZGQ1MTk2MWI2NzlhNWNlMDQ0In0sImlhdCI6MTY4NTE0OTA1MH0.vK3qah28MWhWk7mq-zjxDBOQTSK-BaARWcwg3rnCQo8",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));

    //Logic to edit the note
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
