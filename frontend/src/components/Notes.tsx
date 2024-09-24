import { useEffect, useState } from "react";

type Note = {
    id: number;
    title: string;
    description: string;
    tag: string;
    createdAt: string;
}

const Notes = () => {
    const [notes, setNotes] = useState<[] | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await fetch('http://localhost:3000/notes');
            const data = await response.json();
            console.log(data);
            setNotes(data);
        }

        fetchNotes();
    }, [setNotes]);

    return (
        <div className="columns-3 mt-4">
            {
                notes
                    ? notes.map((note: Note) => (
                        <div
                            className="bg-gray-700 mb-4 p-2 rounded-md break-inside-avoid"
                            key={note.id}
                        >
                            <h2 className="text-xl font-bold">{note.title}</h2>
                            <p className="font-medium my-2">{note.description}</p>
                            <p>{note.tag} | {note.createdAt}</p>
                        </div>
                    ))
                    : <div>Loading...</div>
            }
        </div>
    );
}

export default Notes;
