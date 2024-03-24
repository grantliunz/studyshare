import { Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "./pages/login/Login.tsx";
import Landing from "./pages/landing/Landing.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import Signup from "./pages/signup/Signup.tsx";
import { useAuth } from "./util/firebase.tsx";

function App() {
    const user = useAuth();

    return (
        <>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Landing user={user} />} />
                <Route
                    path="/login"
                    element={user ? <Landing user={user} /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={user ? <Landing user={user} /> : <Signup />}
                />
            </Routes>
        </>
    );
}

export default App;
