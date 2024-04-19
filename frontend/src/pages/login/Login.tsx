import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirebaseErrorMessage } from '../../util/firebase';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../contexts/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const { user, login, loginWithGoogle } = useAuth();

  if (user) {
    navigate('/');
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    login(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error: FirebaseError) => {
        setNotice(getFirebaseErrorMessage(error.code));
      });
  };

  const submitGoogle = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
        maxWidth: '600px',
        margin: '0 auto'
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
      >
        Log In
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
    </Box>
  );
}
