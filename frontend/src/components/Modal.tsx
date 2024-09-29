import { useContext, useRef } from 'react';
import '../styles/modal.css'
import { NoteContext } from '../contexts/NoteContext';

type Props = {
    setShowModal: (showModal: boolean) => void;
}

const Modal = ({ setShowModal }: Props) => {
    const { setNotes } = useContext(NoteContext);
    const titleRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    async function handleAddNote() {
        if (!titleRef.current || !tagRef.current || !descriptionRef.current) return;

        const title = titleRef.current.value;
        const tag = tagRef.current.value;
        const description = descriptionRef.current.value;

        try {
            const response = await fetch('http://localhost:3000/notesCreate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, tag, description }),
                credentials: 'include',
            });

            const data = await response.json();
            switch (response.status) {
                case 201:
                    setNotes(prevNotes => prevNotes ? [...prevNotes, data] : [data]);
                    break;
                case 401:
                    console.log('Not authorized');
                    break;
                case 500:
                    console.log('Error creating note');
                    break;
                default:
                    console.log('Unexpected error');
            }
        } catch {
            console.log('Technical error 😥.');
        } finally {
            setShowModal(false);
        }
    }

    return (
        <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='flex items-end justify-between'>
                    <div className='flex gap-6'>
                        <div>
                            <p className='font-bold text-xl'>Title</p>
                            <input
                                className='outline-none bg-black/20 rounded-sm p-1 focus:ring-2 focus:ring-green-700'
                                type="text"
                                ref={titleRef}
                            />
                        </div>
                        <div>
                            <p className='font-bold text-xl'>Tag</p>
                            <input
                                className='outline-none bg-black/20 rounded-sm p-1 focus:ring-2 focus:ring-green-700'
                                type="text"
                                ref={tagRef}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={handleAddNote}
                            className='bg-green-700 w-14 h-7 rounded-sm font-medium'
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className='bg-red-700 w-14 h-7 rounded-sm font-medium'
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div className='mt-2'>
                    <p className='font-bold text-xl'>Description</p>
                    <textarea
                        className='w-[700px] h-64 resize-none p-1 outline-none bg-black/20 rounded-sm focus:ring-2 focus:ring-green-700'
                        ref={descriptionRef}
                    />
                </div>
            </div>
        </div>
    );
}

export default Modal;
