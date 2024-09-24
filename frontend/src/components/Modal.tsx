import { useRef } from 'react';
import '../styles/modal.css'

type Props = {
    setShowModal: (showModal: boolean) => void;
    addNote: (title: string, description: string, tag: string) => void;
}

const Modal = ({ setShowModal, addNote }: Props) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='flex items-end justify-between'>
                    <div className='flex gap-6'>
                        <div>
                            <p className='font-bold text-xl'>Title</p>
                            <input
                                className='outline-none bg-black/20 rounded-sm p-1'
                                type="text"
                                ref={titleRef}
                            />
                        </div>
                        <div>
                            <p className='font-bold text-xl'>Tag</p>
                            <input
                                className='outline-none bg-black/20 rounded-sm p-1'
                                type="text"
                                ref={tagRef}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => { addNote(titleRef.current!.value, descriptionRef.current!.value, tagRef.current!.value) }}
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
                        className='w-[700px] h-64 resize-none p-1 outline-none bg-black/20 rounded-sm'
                        ref={descriptionRef}
                    />
                </div>
            </div>
        </div>
    );
}

export default Modal;
