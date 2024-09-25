const Registration = () => {
    return (
        <div>
            <div className="size-full flex flex-col gap-4 p-8">
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="text"
                        placeholder="Username"
                        required
                        minLength={4}
                    />
                </div>
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="email"
                        placeholder="Email"
                        required
                        minLength={4}
                    />
                </div>
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="password"
                        placeholder="Password"
                        required
                        minLength={8}
                    />
                </div>
                <div>
                    <input
                        className="outline-none rounded-sm bg-black/20 p-2 w-full"
                        type="password"
                        placeholder="Comfirm password"
                        required
                        minLength={8}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 w-full h-10 rounded-sm font-medium"
                >
                    Sign up
                </button>
            </div>
        </div>
    );
}

export default Registration;
