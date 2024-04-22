import { Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './pages/login/Login.tsx';
import Landing from './pages/landing/Landing.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import Signup from './pages/signup/Signup.tsx';
import { AuthProvider } from './contexts/UserContext.tsx';

import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E1E1E'
    },
    secondary: {
      main: '#c5d5ff'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
