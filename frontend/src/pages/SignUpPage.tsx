import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const avatarList = [
    "apple.jpg",
    "banana.jpg",
    "orange.jpg",
    "strawberry.jpg",
    "watermelon.jpg",
    "pineapple.jpg",
];

const SignUpPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState(avatarList[0]);



    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, avatar }),
                credentials: 'include',
            });

            switch (response.status) {
                case 201:
                    navigate('/auth/signin');
                    break;
                case 400:
                    setError("Invalid data.");
                    break;
                case 409:
                    setError("Username or email already in use.");
                    break;
                default:
                    setError("Unexpected error. Please try again.");
            }

        } catch {
            setError("Technical error 😥.");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white/20 rounded-sm p-4 w-[400px]"
            >
                <div>
                    <h2 className="text-2xl font-bold text-center">Sign up</h2>
                </div>
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
                            minLength={8}
                            value={password}
                            required
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
                    <div>
                        <p className="text-center mb-2 font-medium">Select your avatar</p>
                        <div className="columns-3">
                            {
                                avatarList.map((item, index) => (
                                    <div
                                        className={`rounded-full overflow-hidden mb-3 cursor-pointer ${avatar == item ? "outline outline-offset-2 outline-white" : ""}`}
                                        key={index}
                                        onClick={() => setAvatar(item)}
                                    >
                                        <img src={"/" + item} alt={item} />
                                    </div>
                                ))
                            }
                        </div>
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
                        Sign up
                    </button>
                    <div className="font-medium">
                        <span>Do you have an account? <Link className="text-blue-500" to="/auth/signin">Sign in</Link></span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;