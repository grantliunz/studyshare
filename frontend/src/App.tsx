import { Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './pages/login/Login.tsx';
import Landing from './pages/landing/Landing.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import Signup from './pages/signup/Signup.tsx';
import { AuthProvider } from './contexts/UserContext.tsx';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
