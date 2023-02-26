import React, { useState, useEffect, StrictMode } from "react";
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';

function App() {
  const [sidebar, setSidebar] = useState([])
  const [noteDeleted, setNoteDeleted] = useState(false);
  const [noteAdded, setNoteAdded] = useState(false);
  const [active, setActive] = useState(false);
  const [edit, setEdit] = useState(true);
  const [save, setSave] = useState(false);
  const [date, setDate] = useState(Date.now());

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

  const addNote = () => {
    const newNote = { id: uuidv4(), title: "New", body: "", date: Date.now() };
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
    console.log(date);
    console.log("joe");
    setSidebar(edited);
    setSave(false);
    setNoteAdded(true);
  }

  const hide = () => {
    const side = document.getElementById("sidebar");
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
  }, [noteDeleted]);

  useEffect(() => {
    for (let i = 0; i < sidebar.length; i++) {
      if (sidebar[i].id === active) {
        setText(sidebar[i].body);
        setTitle(sidebar[i].title);
      }
    }
  }, [active])

  useEffect(() => {
    if (noteAdded){
      localStorage.setItem("notes", JSON.stringify(sidebar));
      setNoteAdded(false);
    }
  }, [noteAdded])


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
      <div className="unactive-flex">
        <div id="sidebar">
          <h2 id="head">Notes</h2>
          <button id="add" onClick={addNote}>+</button>
          <div className="unactive">No notes yet</div>
        </div>
        <div className="unactive-body">No notes, please create a new one</div>
      </div>
    ) : (
      <div id="cols">
        <div id="sidebar">
          <h2 id="head">Notes</h2>
          <button id="add" onClick={addNote}>+</button>
        </div>
        <div className="note-list">
          {sidebar.map((note) => (
            <div className={`main-note ${note.id === active ? "active" : ""}`} key={note.id} onClick={() => { setActive(note.id) }}>
              <div className="main-note-preview">
                <strong>{note.title}</strong>
                <p>{note.body.substr(0, 100) + "..."}</p>
                <p>{formatDate(note.date)}</p>
              </div>
              {note.id === active && (
                !edit ? (
                  <div className="main">
                    <div className="editing-menu">
                      <input readOnly={true} type="text" id="note-title" placeholder="Note Title" value={note.title}></input>
                      <button onClick={() => { setEdit(true); setSave(true) }}>edit</button>
                      <button onClick={() => confirm(note.id)}>delete</button>
                      <input type="datetime-local" defaultValue={(new Date(note.date)).toISOString().slice(0, 19)} />
                      <ReactQuill readOnly={true} theme="snow" value={note.body} placeholder="Type your note here."></ReactQuill>
                    </div>
                  </div>
                ) : (
                  <div className="main">
                    <div className="editing-menu">
                      <input type="text" id="note-title" placeholder="Note Title" onChange={(e) => titleChange(e.target.value)} value={title} autoFocus></input>
                      <button onClick={() => { setEdit(false); saveChanges(); }}>save</button>
                      <button onClick={() => confirm(note.id)}>delete</button>
                      <input type="datetime-local" defaultValue={(new Date(note.date)).toISOString().slice(0, 19)} onChange={(e) => setDate(e.target.value)} />
                      <ReactQuill theme="snow" value={text} onChange={textChange} placeholder="Type your note here."></ReactQuill>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </>)
}

// TO DO: 

// CSS
// ROUTING

export default App;
