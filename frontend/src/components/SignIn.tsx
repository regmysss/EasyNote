import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const SingIn = () => {
    const { updateAuth } = useContext(AuthContext);
    const navegate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();

            switch (response.status) {
                case 200:
                    updateAuth(username, data.email, data.avatar);
                    navegate('/notes', { replace: true });
                    break;
                case 400:
                    setError("Invalid username or password.");
                    break;
                case 404:
                    setError("Username not found.");
                    break;
                default:
                    setError("Unexpected error. Please try again.");
            }
        } catch {
            setError("Technical error 😥.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
        >
            <div className="size-full flex flex-col gap-4 p-8">
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="text"
                        placeholder="Username"
                        required
                        minLength={4}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="password"
                        placeholder="Password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <Link to="#" className="text-center">Forgot password?</Link>
                </div>
                {
                    error &&
                    <div className="flex justify-center items-center h-10 border-2 border-red-500 rounded-sm bg-red-500/5 font-medium text-red-500">
                        <p>
                            {error}
                        </p>
                    </div>
                }
                <button
                    type="submit"
                    className="bg-green-700 w-full h-10 rounded-sm font-medium"
                >
                    Sign in
                </button>
            </div>
        </form>
    );
}

export default SingIn;
