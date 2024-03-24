import { Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "./pages/login/Login.tsx";
import Landing from "./pages/landing/Landing.tsx";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
    return (
        <>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
