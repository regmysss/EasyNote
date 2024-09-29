import { FormEvent, useState } from "react";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
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
                        type="email"
                        placeholder="Email"
                        required
                        minLength={4}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="password"
                        placeholder="Comfirm password"
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 w-full h-10 rounded-sm font-medium"
                >
                    Sign up
                </button>
            </div>
        </form>
    );
}

export default SignUp;
