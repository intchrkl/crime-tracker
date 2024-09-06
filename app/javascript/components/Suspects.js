import React from "react";
import FormattedDate from "./FormattedDate";
import Select from "react-select";
import PropTypes from "prop-types";
import { find } from "lodash";
import {post, get, put} from "../api";

function SuspectEditor({close, onSave, currentSuspects}) {
    const [options, setOptions] = React.useState([]);
    const [criminalId, setCriminalId] = React.useState();

    React.useEffect(() => {
        get('/v1/criminals').then((response) => {
        setOptions(
            response.criminals.map((criminal) => {
                const criminalAlreadyExists = !!find(currentSuspects, 
                    {
                        data: { 
                            attributes: {
                                criminal: { 
                                    data: {
                                        id: criminal.data.id
                                    }
                                }
                            }
                        },
                    });
                    const criminalData = criminal.data.attributes
                    return {
                        value: criminal.data.id,
                        label: `${criminalData.first_name} ${criminalData.last_name}`,
                        disabled: criminalAlreadyExists,
                    };
                })
            );
        })        }, []);


    return (
        <>
            <Select
                options={options}
                onChange={({ value }) => setCriminalId(value)}
                isOptionDisabled={(option) => option.disabled}
            />
            <button onClick={() => onSave(criminalId)} disabled={!criminalId}>
                Save
            </button>{" "}
            <button onClick={close}>Cancel</button>
        </>
    );
}

SuspectEditor.propTypes = {
    close: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    currentSuspects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Suspects({ suspects, investigationId }) {
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [currentSuspects, setCurrentSuspects] = React.useState(suspects);

    function onSave(criminalId) {
        post(`/v1/investigations/${investigationId}/suspects`, {
            suspect: {
                criminal_id: criminalId,
            },
        }).then((result) => {
            setEditorOpen(false);
            setCurrentSuspects(currentSuspects.concat(result));
        });
    }

    // ChatGPT: Write a function to drop a suspect
    function dropSuspect(criminalId) {
        put(`/v1/drop_suspect/${criminalId}`).then((result) => {
            const index = currentSuspects.findIndex(suspect => suspect.data.id === criminalId);
            const newSuspects = currentSuspects.map((sus, i) => {
                if (index === i) {
                    return result;
                }
                else {
                    return sus;
                }
            })
            setCurrentSuspects(newSuspects);
        })
    }

    const content = 
        currentSuspects.length === 0 ? (
        <p>This investigation does not yet have suspects associated with it.</p>
        ) : (
            <>
                <ul>
                    {currentSuspects.map((suspect) => {
                        const suspectData = suspect.data.attributes;
                        const {first_name, last_name} = suspectData.criminal.data.attributes;
                        return (
                            <li key={`suspect-${suspect.data.id}`}>
                                <span><strong><i>{first_name}{" "}{last_name}</i></strong></span>
                                <ul>
                                    <li>{"Added: "}{FormattedDate(suspectData.added_on)}</li>
                                    <li>{"Dropped: "}{suspectData.dropped_on === null ? (<span>N/A</span>) : FormattedDate(suspectData.dropped_on)}</li>
                                    {suspectData.dropped_on === null ? 
                                        (<button onClick = {() => dropSuspect(suspect.data.id)}>Drop</button>)
                                        :
                                        (<br></br>)
                                    }
                                </ul>
                                <br></br>
                            </li>
                        )
                    })}
                </ul>
        </>
    );

    return (
        <>
            <div className="card grey lighten-2">
                <div className="card-content">
                    <span className="card-title"><strong>Suspects</strong></span>
                    {content}
                    {editorOpen && (
                        <SuspectEditor
                            close={() => setEditorOpen(false)}
                            onSave={onSave}
                            currentSuspects={currentSuspects}
                        />
                    )}
                    {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}
                </div>
            </div>
        </>
    );
}

Suspects.propTypes = {
    suspects: PropTypes.arrayOf(PropTypes.object).isRequired,
    investigationId: PropTypes.string.isRequired
};

export default Suspects;