import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login.tsx';
import Landing from './pages/landing/Landing.tsx';
import Signup from './pages/signup/Signup.tsx';
import UniversitiesPage from './pages/university/UniversitiesPage.tsx';
import Profile from './pages/profile/Profile.tsx';
import Assessments from './pages/assessments/Assessments.tsx';
import CoursesPage from './pages/course/CoursesPage.tsx';
import { ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header/Header.tsx';
import AssessmentPage from './pages/assessment/AssessmentPage.tsx';
import ErrorPage from './components/ErrorPage.tsx';

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
      {/* <CssBaseline /> */}
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/:universityId" element={<CoursesPage />} />
        <Route path="/:universityId/:courseId" element={<Assessments />} />
        <Route
          path="/:universityId/:courseId/:assessmentId"
          element={<AssessmentPage />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
