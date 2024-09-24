import { Routes as AppRoutes, BrowserRouter, Route } from "react-router-dom";
import Notes from "./Notes";

const Routes = () => {
    return (
        <BrowserRouter>
            <AppRoutes>
                <Route path="/" element={<Notes />} />
                <Route path="/profile" element={<div>Profile</div>} />
            </AppRoutes>
        </BrowserRouter>
    );
}

export default Routes;
