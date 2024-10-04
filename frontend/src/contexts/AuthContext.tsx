import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    username: string | null;
    email: string | null;
    avatar: string | null;
    updateAuth: (username: string | null, email: string | null, avatar: string | null) => void;
    updateUsername: (username: string) => void;
    updateEmail: (email: string) => void;
    deleteAccount: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    username: null,
    email: null,
    avatar: null,
    updateAuth: () => { },
    updateUsername: () => { },
    updateEmail: () => { },
    deleteAccount: () => { },
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username') || null);
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email') || null);
    const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('avatar') || null);

    useEffect(() => {
        localStorage.setItem('username', username || '');
        localStorage.setItem('email', email || '');
        localStorage.setItem('avatar', avatar || '');
    }, [username, email, avatar]);

    function updateAuth(username: string | null, email: string | null, avatar: string | null) {
        setUsername(username);
        setEmail(email);
        setAvatar(avatar);
    }

    async function updateUsername(username: string) {
        try {
            const response = await fetch('http://localhost:3000/auth/update/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                setUsername(username);
            }
        } catch {
            console.log('Failed to update username');
        }
    }

    async function updateEmail(email: string) {
        try {
            const response = await fetch('http://localhost:3000/auth/update/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmail(email);
            }
        } catch {
            console.log('Failed to update email');
        }
    }

    async function deleteAccount() {
        try {
            const response = await fetch('http://localhost:3000/auth/delete', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                updateAuth(null, null, null);
            }
        } catch {
            console.log('Failed to delete account');
        }
    }

    return (
        <AuthContext.Provider value={{ username, email, avatar, updateAuth, updateUsername, updateEmail, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
