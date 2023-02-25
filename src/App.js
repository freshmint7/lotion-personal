import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { json } from "react-router-dom";

function App() {
  const [sidebar, setSidebar] = useState([]);
  const [noteDeleted, setNoteDeleted] = useState(false);
  const [active, setActive] = useState(false);
  const [edit, setEdit] = useState(true);
  const [save, setSave] = useState(false);
  const [text, setText] = useState("");

  const addNote = () => {
    const newNote = { id: uuidv4(), title: "New", body: "" };
    setSidebar([newNote, ...sidebar]);
    setActive(newNote.id);
  };

  const delNote = (id) => {
    let saved = sidebar.filter((note) => note.id !== id);
    setSidebar(saved);
    setNoteDeleted(true);
  };

  /*const editTitle = (field, val) => {
    const edited = sidebar.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          [field]: val,
        }
      }
      else {
        return note;
      };
    });
    console.log(edited);
    if (save) {
      setSidebar(edited);
      console.log("saved")
    } 
  };*/

  const textChange = (userInput) => {
    setText(userInput);
  }

  const hide = () => {
    const side = document.getElementById("sidebar");
    const notelist = document.getElementsByClassName("main-note");
    const notetitle = document.getElementsByClassName("main-note-title");

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
    }
  }, [ noteDeleted]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(sidebar));
    console.log( JSON.parse(localStorage.getItem('notes')))
  }, [sidebar])

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
        <div className="unactive">No notes, please create a new one</div>
      </div>
    ) : (
      <div id="cols">
        <div id="sidebar">
          <h2 id="head">Notes</h2>
          <button id="add" onClick={addNote}>+</button>
        </div>
        <div className="note-list">
          {sidebar.map((note) => (
            <div className={`main-note ${note.id === active ? "active" : ""}`} key={note.id} onClick={() => setActive(note.id)}>
              <div className="main-note-title">
                <strong>{note.title}</strong></div>
              {note.id === active && (
                !edit ? (
                  <div className="main">
                    <div className="editing-menu">
                      <input readOnly={true} type="text" id="note-title" placeholder="Note Title" value={note.title}></input>
                      <button onClick={() => { setEdit(true); setSave(false) }}>edit</button>
                      <button onClick={() => confirm(note.id)}>delete</button>
                      <input type="datetime-local" />
                      <ReactQuill readOnly={true} theme="snow" value={note.body} placeholder="Type your note here."></ReactQuill>
                    </div>
                  </div>
                ) : (
                  <div className="main">
                    <div className="editing-menu">
                      <input type="text" id="note-title" placeholder="Note Title" onChange={() => editTitle())} value={note.title} autoFocus></input>
                      <button onClick={() => { setEdit(false); setSave(true) }}>save</button>
                      <button onClick={() => confirm(note.id)}>delete</button>
                      <input type="datetime-local" />
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

export default App;
