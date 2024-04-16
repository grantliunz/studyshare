import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/UserContext';

export default function Landing() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Landing Page</h1>
      {!user ? (
        <Button variant="contained" color="primary" href="/login">
          Login
        </Button>
      ) : (
        <>
          <p>{user.email}</p>
          <Button variant="contained" color="primary" onClick={logout}>
            Log out
          </Button>
        </>
      )}
    </div>
  );
}
