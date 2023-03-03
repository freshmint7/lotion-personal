import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "./Sidebar";
import { Link } from 'react-router-dom';

function App() {
  const [sidebar, setSidebar] = useState([]);
  const [noteDeleted, setNoteDeleted] = useState(false);
  const [noteAdded, setNoteAdded] = useState(false);
  const [active, setActive] = useState(false);
  const [edit, setEdit] = useState(true);
  const [save, setSave] = useState(false);
  const [date, setDate] = useState(Date.now());
  const [index, setIndex] = useState([]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const loadData = () => {
      const stored = JSON.parse(localStorage.getItem("notes"));
      if (Array.isArray(stored) && stored.length > 0) {
        setSidebar(stored);
        setActive(stored[0].id);
      }
    }
    loadData();
  }, [])

  useEffect(() => {
    const entries = [];
    for (let i = 0; i < sidebar.length; i++) {
      let newEntry = { id: sidebar[i].id, index: i }
      entries.push(newEntry)
    }
    setIndex(entries);
  }, [sidebar])

  const addNote = () => {
    const newNote = { id: uuidv4(), title: "Untitled Note", body: "", date: Date.now() };
    setSidebar([newNote, ...sidebar]);
    setActive(newNote.id);
    setNoteAdded(true);
  };

  const delNote = (id) => {
    let saved = sidebar.filter((note) => note.id !== id);
    setSidebar(saved);
    setNoteDeleted(true);
  };

  const titleChange = (userInput) => {
    setTitle(userInput);
    setSave(true);
  }

  const textChange = (userInput) => {
    setText(userInput);
    setSave(true);
    setDate(Date.now());
  }

  const saveChanges = () => {
    if (!save) {
      return;
    }
    const edited = sidebar.map((note) => {
      if (note.id === active) {
        if (title === "") {
          return {
            ...note,
            "title": "Untitled Note",
            "body": text.substring(3, text.length - 4),
            "date": date,
          }
        }
        return {
          ...note,
          "title": title,
          "body": text.substring(3, text.length - 4),
          "date": date,
        }
      }
      else {
        return note;
      };
    });
    setSidebar(edited);
    setSave(false);
    setNoteAdded(true);
  }

  const hide = () => {
    const side = document.getElementById("aside");
    const notelist = document.getElementsByClassName("main-note");
    const notetitle = document.getElementsByClassName("main-note-preview");

    if (side.style.display === "none") {
      side.style.display = "";
      for (let i = 0; i < notelist.length; i++) {
        notelist[i].style.display = "";
        notetitle[i].style.display = "";
      }
    } else {
      side.style.display = "none";
      for (let i = 0; i < notelist.length; i++) {
        notetitle[i].style.display = "none";
        if (!notelist[i].classList.contains("active")) {
          notelist[i].style.display = "none";
        }
      }
    }
  };

  const confirm = (noteId) => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      delNote(noteId);
    }
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  useEffect(() => {
    if (noteDeleted) {
      if (sidebar.length > 0) {
        setActive(sidebar[0].id);
      } else {
        setActive(false);
      }
      setNoteDeleted(false);
      localStorage.setItem("notes", JSON.stringify(sidebar))
    }
  }, [noteDeleted, sidebar]);

  useEffect(() => {
    for (let i = 0; i < sidebar.length; i++) {
      if (sidebar[i].id === active) {
        setText(sidebar[i].body);
        setTitle(sidebar[i].title);
      }
    }
  }, [active, sidebar])

  useEffect(() => {
    if (noteAdded) {
      localStorage.setItem("notes", JSON.stringify(sidebar));
      setNoteAdded(false);
    }
  }, [noteAdded, sidebar])

  const link = edit ? '/edit' : '';

  return (<>
    <hr />
    <div id="top">
      <button id="menu" onClick={() => hide()}>&#9776;</button>
      <div id="title">
        <h1>Lotion</h1>
        <p>Like Notion, but better</p>
      </div>
    </div>
    <hr />
    {!active ? (
      <div id="cols">
        <div id="aside">
          <div id="sidebar">
            <p id="head"><strong>Notes</strong></p>
            <Link to={`/note/1${link}`}>
              <button id="add" onClick={addNote}>+</button>
            </Link>
          </div>
          <div className="unactive">No notes yet</div>
        </div>
        <div className="unactive-body">No notes, please create a new one</div>
      </div>
    ) : (
      <Sidebar sidebar={sidebar} formatDate={formatDate} setActive={setActive} active={active} edit={edit} setEdit={setEdit} setSave={setSave} confirm={confirm} saveChanges={saveChanges} text={text} textChange={textChange} title={title} titleChange={titleChange} setDate={setDate} index={index} addNote={addNote} />
    )}
  </>)
}

export default App;
