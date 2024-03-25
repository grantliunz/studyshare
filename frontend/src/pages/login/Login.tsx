import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle, useAuth } from '../../util/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const user = useAuth();

  if (user) {
    navigate('/');
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    console.log({ email, password });
    login(email, password)
      .then((user) => {
        console.log(user);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        setNotice(error.message);
      });
  };

  const submitGoogle = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
