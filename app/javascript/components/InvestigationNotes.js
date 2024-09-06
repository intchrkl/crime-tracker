import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import { get, post } from "../api";
import FormattedDate from "./FormattedDate";

    
function InvestigationNotesEditor({ close, onSave, currentNotes }) {
    const [noteContent, setNoteContent] = React.useState("");

    const handleChange = (event) => {
        setNoteContent(event.target.value);
    };

    return (
        <div>
            <textarea
                value={noteContent}
                onChange={handleChange}
            />
            <button onClick={() => onSave(noteContent)}>Save</button>
            <button onClick={close}>Cancel</button>
        </div>
    );
}

InvestigationNotesEditor.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentNotes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
  

function InvestigationNotes({ notes, investigationId }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [currentNotes, setcurrentNotes] = React.useState(notes);

  function onSave(text) {
    post(`/v1/investigations/${investigationId}/notes`, {
      investigation_note: {
        content: text,
      },
    }).then((result) => {
      setEditorOpen(false);
      setcurrentNotes(currentNotes.concat(result));
    });
  }

  const content =
    currentNotes.length === 0 ? (
      <p>This investigation does not yet have notes associated with it.</p>
    ) : (
      <>
        <ul>
            {currentNotes.map((note) => {
            const noteData = note.data.attributes
            const officerData = noteData.officer.data.attributes
            return (
              <li key={`note-${note.data.id}`}>
                <p><strong>{FormattedDate(noteData.date)}{": "}</strong>{noteData.content}</p>
                <p><strong>{"- "}{officerData.first_name}{" "}{officerData.last_name}</strong></p>
                <br></br>
              </li>
            );
          })}
        </ul>
      </>
    );

  return (
    <>
      <div class="card grey lighten-2">
        <div class="card-content">
          <span class="card-title"><strong>Investigation Notes</strong></span>
            {content}
            {editorOpen && (
              <InvestigationNotesEditor
                close={() => setEditorOpen(false)}
                onSave={onSave}
              />
            )}
            {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}

        </div>
      </div>
    </>
  );
}

InvestigationNotes.propTypes = {
  crimes: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.number.isRequired,
};

export default InvestigationNotes;