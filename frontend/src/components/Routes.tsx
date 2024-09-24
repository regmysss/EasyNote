import { Routes as AppRoutes, BrowserRouter, Route } from "react-router-dom";
import Notes from "./Notes";

const Routes = () => {
    return (
        <div>
            <div className="flex justify-between items-end">
                <div className="rounded-full size-14 overflow-hidden cursor-pointer">
                    <img
                        className="size-full object-cover"
                        src="logo.jpg" alt="logo.jpg"
                    />
                </div>
                <button className="bg-green-700 w-14 h-7 rounded-sm font-medium">
                    Add
                </button>
            </div>
            <BrowserRouter>
                <AppRoutes>
                    <Route path="/" element={<Notes />} />
                    <Route path="/about" element={<div>Hello Ab</div>} />
                </AppRoutes>
            </BrowserRouter>
        </div>
    );
}

export default Routes;
