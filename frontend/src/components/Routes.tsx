import { Routes as AppRoutes, BrowserRouter, Route } from "react-router-dom";
import Notes from "../pages/NotesPage";
import Auth from "../pages/AuthPage";

const Routes = () => {
    return (
        <BrowserRouter>
            <AppRoutes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/profile" element={<div>Profile</div>} />
            </AppRoutes>
        </BrowserRouter>
    );
}

export default Routes;
