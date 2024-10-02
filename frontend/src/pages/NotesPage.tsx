import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { Note } from "../types";
import { NoteContext } from "../contexts/NoteContext";
import { AuthContext } from "../contexts/AuthContext";

const Notes = () => {
    const { notes, setNotes, deleteNote } = useContext(NoteContext);
    const { avatar } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    function formatDate(date: string) {
        const d = new Date(date);
        const dateOptions = { day: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions;
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false } as Intl.DateTimeFormatOptions;

        const dateFormated = d.toLocaleDateString('en-GB', dateOptions);
        const timeFormated = d.toLocaleTimeString('en-GB', timeOptions);

        return `${dateFormated} ${timeFormated}`;
    }

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:3000/notes', {
                    credentials: 'include',
                });
                const data = await response.json();

                switch (response.status) {
                    case 200:
                        setNotes(data);
                        break;
                    case 401:
                        console.log('Not authorized');
                        break;
                    case 500:
                        console.log('Error fetching notes');
                        break;
                    default:
                        console.log('Unexpected error');
                }
            } catch {
                console.log('Technical error 😥.');
            }
        }

        fetchNotes();
    }, [setNotes]);

    return (
        <div className="mt-2 w-[1000px] mx-auto">
            <div className="flex justify-between items-end mb-4">
                <Link to='/profile'>
                    <div className="rounded-full size-14 overflow-hidden cursor-pointer">
                        <img
                            className="size-full object-cover"
                            src={avatar!} alt={avatar!}
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
            {
                notes && notes.length != 0
                    ? <div className="columns-3">
                        {
                            notes.map((note: Note) => (
                                <div
                                    className="bg-white/20 mb-4 p-4 rounded-sm break-inside-avoid"
                                    key={note.id}
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold truncate">{note.title}</h2>
                                        <button
                                            className="flex items-center justify-center size-6"
                                            onClick={() => deleteNote(note.id)}
                                        >
                                            <img
                                                src="delete.png"
                                                alt="delete.png"
                                            />
                                        </button>
                                    </div>
                                    <p className="my-4 break-words">{note.description}</p>
                                    <p className="text-gray-300 text-sm">{note.tag} | {formatDate(note.createdAt)}</p>
                                </div>
                            ))
                        }
                    </div>
                    : <div className="flex justify-center">
                        <span className="text-xl font-bold">
                            There is nothing here yet 🙁
                        </span>
                    </div>
            }

            {
                showModal && <Modal setShowModal={setShowModal} />
            }
        </div >
    );
}

export default Notes;
