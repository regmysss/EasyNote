import React, { createContext, useState } from "react";
import { Note } from "../types";

type NoteContextType = {
    notes: Note[] | null;
    setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
    deleteNote: (id: number) => void;
};

export const NoteContext = createContext<NoteContextType>({
    notes: null,
    setNotes: () => { },
    deleteNote: () => { },
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
    const [notes, setNotes] = useState<Note[] | null>(null);

    async function deleteNote(id: number) {
        if (!notes) return;

        try {
            const response = await fetch(`http://localhost:3000/notesDelete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            switch (response.status) {
                case 200:
                    setNotes(notes.filter(note => note.id !== id));
                    break;
                case 401:
                    console.log('Not authorized');
                    break;
                case 404:
                    console.log('Note not found');
                    break;
                default:
                    console.log('Unexpected error');
            }
        } catch {
            console.log('Technical error 😥.');
        }
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, deleteNote }}>
            {children}
        </NoteContext.Provider>
    );
}

export default NoteProvider;
