import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';
import Login from './pages/login/Login.tsx';
import Landing from './pages/landing/Landing.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import Signup from './pages/signup/Signup.tsx';
import University from './pages/university/University.tsx';
import CoursePage from './pages/Course/Course.tsx';
import { useAuth } from './contexts/UserContext.tsx';

import { ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header/Header.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E1E1E'
    },
    secondary: {
      main: '#41709B'
    }
  }
});

function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname == '/' ||
    location.pathname == '/login' ||
    location.pathname == '/signup'
      ? true
      : false;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/universities" element={<University />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
