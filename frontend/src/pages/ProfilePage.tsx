import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProfilePage = () => {
    const { username, email } = useContext(AuthContext);

    return (
        <div className="flex gap-4 mt-2">
            <div>
                <div className="size-64 overflow-hidden rounded-full">
                    <img
                        className="size-full object-cover"
                        src="logo.jpg" alt=""
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white/40">USERNAME</p>
                            <p>{username}</p>
                        </div>
                        <button className="h-8 w-12 bg-white/40 rounded-sm">Edit</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white/40">EMAIL</p>
                            <p>{email}</p>
                        </div>
                        <button className="h-8 w-12 bg-white/40 rounded-sm">Edit</button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="h-10 w-36 rounded-sm bg-green-700">Change password</button>
                    <button className="h-10 w-36 rounded-sm bg-red-700">Delete an account</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
