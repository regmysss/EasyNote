import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    username: string | null;
    email: string | null;
    avatar: string | null;
    updateAuth: (username: string | null, email: string | null, avatar: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    username: null,
    email: null,
    avatar: null,
    updateAuth: () => { },
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

    return (
        <AuthContext.Provider value={{ username, email, avatar, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
