import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirebaseErrorMessage } from '../../util/firebase';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../contexts/UserContext';
import styles from './Login.module.css';
import { Paper, CircularProgress } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading state
  const { user, login, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/universities');
    }
  }, [user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    login(email, password)
      .then(() => {
        navigate('/universities');
        setLoading(false); // Set loading state to false on success
      })
      .catch((error: FirebaseError) => {
        setNotice(getFirebaseErrorMessage(error.code));
        setLoading(false); // Set loading state to false on error
      });
  };

  const submitGoogle = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className="grid" />
      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        style={{
          minWidth: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '20px'
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <p>{notice}</p>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} />}
        >
          {!loading ? 'Log In' : ''}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        <Button onClick={submitGoogle}>Log In with Google</Button>
      </Paper>
    </div>
  );
}
