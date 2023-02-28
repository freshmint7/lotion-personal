import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';

const Content = ({
	note,
	title,
	titleChange,
	setEdit,
	saveChanges,
	confirm,
	setDate,
	text,
	textChange,
	getNoteIndex,
}) => {

	return (
		<div className="main">
			<div className="editing-menu">
				<div className="title-date">
					<input type="text" id="note-title" placeholder="Note Title" onChange={(e) => titleChange(e.target.value)} value={title} autoFocus></input>
					<input className="edit-button date" type="datetime-local" defaultValue={(new Date(note.date - 25200000)).toISOString().slice(0, 19)} onChange={(e) => setDate(Date.parse(e.target.value))} />
				</div>
				<div className="buttons">
					<Link to={`/note/${getNoteIndex(note)}`} className="edit-button del">
						<button className="edit-button del center" onClick={() => { setEdit(false); saveChanges(); }}>Save</button>
					</Link>
					<button className="edit-button del" onClick={() => confirm(note.id)}>Delete</button>
				</div>
			</div>
			<ReactQuill className="textbox" theme="snow" value={text} onChange={textChange} placeholder="Type your note here."></ReactQuill>
		</div>
	)
}

export default Content;