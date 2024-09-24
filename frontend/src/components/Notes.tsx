import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { Note } from "../types";

const Notes = () => {
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch('http://localhost:3000/notes');
            const data = await response.json();
            setNotes(data);
        }

        fetchNotes();
    }, [setNotes]);

    function addNote(title: string, description: string, tag: string) {
        setNotes(prev => [...(prev || []), {
            id: 6,
            title: title,
            description: description,
            tag: tag,
            createdAt: 'September 25, 2024'
        }]);

        setShowModal(false);
    }

    return (
        <div>
            <div className="flex justify-between items-end">
                <Link to='/profile'>
                    <div className="rounded-full size-14 overflow-hidden cursor-pointer">
                        <img
                            className="size-full object-cover"
                            src="logo.jpg" alt="logo.jpg"
                        />
                    </div>
                </Link>
                <button
                    className="bg-green-700 w-14 h-7 rounded-sm font-medium"
                    onClick={() => setShowModal(true)}
                >
                    Add
                </button>
            </div>
            <div className="columns-3 mt-4">
                {
                    notes
                        ? notes.map((note: Note) => (
                            <div
                                className="bg-white/20 mb-4 p-4 rounded-md break-inside-avoid"
                                key={note.id}
                            >
                                <h2 className="text-xl font-bold">{note.title}</h2>
                                <p className="my-4 break-words">{note.description}</p>
                                <p className="text-gray-300 text-sm">{note.tag} | {note.createdAt}</p>
                            </div>
                        ))
                        : <div>Loading...</div>
                }
            </div>
            {
                showModal && <Modal setShowModal={setShowModal} addNote={addNote} />
            }
        </div >
    );
}

export default Notes;
