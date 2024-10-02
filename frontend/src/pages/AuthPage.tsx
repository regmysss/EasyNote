import { useEffect, useState } from "react";
import { AuthMode } from "../types";
import SingIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Auth = () => {
    const [authMode, setAuthMode] = useState<AuthMode | null>(null);

    useEffect(() => {
        const authModeParam = new URLSearchParams(window.location.search).get('authMode');

        if (!authModeParam)
            setAuthMode('signin');

        if (authModeParam === 'signin' || authModeParam === 'signup')
            setAuthMode(authModeParam);
        else
            setAuthMode('signin');
    }, []);

    useEffect(() => {
        if (!authMode) return;
        const url = new URL(window.location.href);

        url.searchParams.set('authMode', authMode);
        window.history.replaceState({}, '', url);
    }, [authMode]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white/20 rounded-sm p-4 w-[400px]">
                <div className="flex items-center justify-around">
                    <button className={`h-10 text-xl font-bold size-full ${authMode === 'signin' ? 'border-b-2' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setAuthMode('signin');
                        }}
                    >
                        Sign in
                    </button>
                    <button className={`h-10 text-xl font-bold size-full ${authMode === 'signup' ? 'border-b-2' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setAuthMode('signup')
                        }}
                    >
                        Sign Up
                    </button>
                </div>
                {
                    authMode === 'signin'
                        ? <SingIn />
                        : <SignUp />
                }
            </div>
        </div>
    );
}

export default Auth;
