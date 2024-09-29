import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    username: string | null;
    email: string | null;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    email: null,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/check', {
                    credentials: 'include',
                });
                
                const data = await response.json();

                switch (response.status) {
                    case 200:
                        setIsAuthenticated(true);
                        setUsername(data.username);
                        setEmail(data.email);
                        break;
                    case 401:
                        console.log('Not authorized');
                        break;
                    default:
                        console.log('Unexpected error');
                }
            } catch {
                console.log('Technical error 😥.');
            }
        };

        fetchAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, email }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
