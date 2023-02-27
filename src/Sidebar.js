import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Content from "./Content";
import { Link } from 'react-router-dom';

const Sidebar = ({
	sidebar,
	formatDate,
	setActive,
	active,
	edit,
	setEdit,
	setSave,
	confirm,
	saveChanges,
	text,
	textChange,
	title,
	titleChange,
	setDate,
	index,
	addNote,
}) => {

	const getNoteIndex = (note) => {
		for (let i = 0; i < index.length; i++) {
			if (note.id === index[i].id) {
				return String(index[i].index + 1);
			}
		}
	}

	const link = edit ? '/edit' : '';

	return (
		<div id="cols">
			<div id="aside">
				<div id="sidebar">
					<p id="head"><strong>Notes</strong></p>
					<Link to={`/note/1${link}`}>
						<button id="add" onClick={addNote}>+</button>
					</Link>
				</div>
				<div className="note-list">
					{sidebar.map((note) => (
						<div className={`main-note ${note.id === active ? "active" : ""}`} onClick={() => { setActive(note.id) }} key={note.id}>
							<Link to={`/note/${getNoteIndex(note)}${link}`}>
								<div className="main-note-preview">
									<strong id="pre-title">{note.title}</strong>
									<p id="pre-date">{formatDate(note.date)}</p>
									<ReactQuill readOnly={true} id="pre-body" modules={{ toolbar: false }} value={note.body.substr(0, 50) + "..."}></ReactQuill>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
			<div id="note-message">
				{sidebar.map((note) => (
					note.id === active && (
						!edit ? (
							<div key={note.id} className="main" >
								<div className="editing-menu">
									<div className="title-date">
										<p id="note-title"><strong>{note.title}</strong></p>
										<p id="pre-date" className="displaydate">{formatDate(note.date)}</p>
									</div>
									<div className="buttons">
										<Link to={`/note/${getNoteIndex(note)}/edit`}>
											<button className="edit-button del" onClick={() => { setEdit(true); setSave(true) }}>Edit</button>
										</Link>
										<button className="edit-button del" onClick={() => confirm(note.id)}>Delete</button>
									</div>
								</div>
								<ReactQuill className="textbox" modules={{ toolbar: false }} readOnly={true} value={text} onChange={textChange}></ReactQuill>
							</div>
						) : (
							<Content key={note.id} note={note} title={title} titleChange={titleChange} setEdit={setEdit} saveChanges={saveChanges} confirm={confirm} setDate={setDate} text={text} textChange={textChange} getNoteIndex={getNoteIndex} />
						)
					)
				))}
			</div>
		</div>
	);
};

export default Sidebar;