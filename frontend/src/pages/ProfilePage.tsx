import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { username, email, avatar, updateAuth } = useContext(AuthContext);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    async function signOut() {
        try {
            const response = await fetch('http://localhost:3000/auth/signout', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                updateAuth(null, null, null);
                navigate('/');
            }
        } catch {
            navigate('/');
        }
    }

    useEffect(() => {
        if (!usernameRef.current) return;

        usernameRef.current.focus();
    }, [isEditingUsername]);

    useEffect(() => {
        if (!emailRef.current) return;

        emailRef.current.focus();
    }, [isEditingEmail]);

    return (
        <div className="flex gap-4 mt-2 w-[1000px] mx-auto">
            <div>
                <div className="size-64 overflow-hidden rounded-full">
                    <img
                        className="size-full object-cover"
                        src={avatar!} alt={avatar!}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white/40">USERNAME</p>
                            <input
                                className={`outline-none rounded-sm bg-transparent w-full ${!isEditingUsername && "hidden"}`}
                                type="text"
                                defaultValue={username!}
                                placeholder="Enter new username"
                                ref={usernameRef}
                            />
                            <p className={`${isEditingUsername && "hidden"}`}>{username}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-white/40 rounded-sm"
                                onClick={() => setIsEditingUsername(!isEditingUsername)}
                            >
                                {
                                    isEditingUsername
                                        ? "Cansel"
                                        : "Edit"
                                }
                            </button>
                            {isEditingUsername &&
                                <button className="px-3 py-1 rounded-sm bg-green-700">
                                    Save
                                </button>
                            }
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white/40">EMAIL</p>
                            <input
                                className={`outline-none rounded-sm bg-transparent w-full ${!isEditingEmail && "hidden"}`}
                                type="text"
                                defaultValue={email!}
                                placeholder="Enter new email"
                                ref={emailRef}
                            />
                            <p className={`${isEditingEmail && "hidden"}`}>{email}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-white/40 rounded-sm"
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                            >
                                {
                                    isEditingEmail
                                        ? "Cansel"
                                        : "Edit"
                                }
                            </button>
                            {isEditingEmail &&
                                <button className="px-3 py-1 rounded-sm bg-green-700">
                                    Save
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 rounded-sm bg-green-700">Change password</button>
                    <button className="p-2  rounded-sm bg-red-700">Delete an account</button>
                    <button
                        onClick={signOut}
                        className="p-2 rounded-sm bg-white/40"
                    >Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
