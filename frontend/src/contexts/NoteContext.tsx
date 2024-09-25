import React, { createContext, useState } from "react";
import { Note } from "../types";

type NoteContextType = {
    notes: Note[] | null;
    setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
    addNote: (title: string, description: string, tag: string) => void;
    deleteNote: (id: number) => void;
};

export const NoteContext = createContext<NoteContextType>({
    notes: null,
    setNotes: () => { },
    addNote: () => { },
    deleteNote: () => { },
});

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
    const [notes, setNotes] = useState<Note[] | null>(null);

    function addNote(title: string, description: string, tag: string) {
        const date = new Date();

        const newNote = {
            id: Math.random(),
            title,
            tag,
            description,
            createdAt: `${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()}`
        }

        setNotes((prevNotes: Note[] | null) => prevNotes ? [...prevNotes, newNote] : [newNote]);
    }

    function deleteNote(id: number) {
        setNotes((prevNotes: Note[] | null) => prevNotes ? prevNotes.filter(note => note.id !== id) : null);
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote }}>
            {children}
        </NoteContext.Provider>
    );
}

export default NoteProvider;
