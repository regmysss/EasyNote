import { useState } from "react";
import { AuthMode } from "../types";
import SingIn from "../components/SignIn";
import Registration from "../components/SignUp";

const Auth = () => {
    const [authMode, setAuthMode] = useState<AuthMode>("signin");

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                className="bg-white/20 p-4 rounded-sm w-[500px]"
                action=""
            >
                <div className="flex items-center justify-around">
                    <button className={`h-10 text-xl font-bold size-full ${authMode === 'signin' ? 'border-b-2' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setAuthMode('signin');
                        }}
                    >
                        Sign in
                    </button>
                    <button className={`h-10 text-xl font-bold size-full ${authMode === 'register' ? 'border-b-2' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setAuthMode('register')
                        }}
                    >
                        Registration
                    </button>
                </div>
                <div>
                    {
                        authMode === 'signin'
                            ? <SingIn />
                            : <Registration />
                    }
                </div>
            </form>
        </div>
    );
}

export default Auth;
