import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirebaseErrorMessage } from '../../util/firebase';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../contexts/UserContext';
import styles from './Signup.module.css';
import { Paper, CircularProgress } from '@mui/material';

export default function Signup() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading state
  const { user, createUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/universities');
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setNotice('Passwords do not match');
      setLoading(false); // Set loading state to false
      return;
    }

    createUser(email, password)
      .then(() => {
        navigate('/universities');
      })
      .catch((error: FirebaseError) => {
        setNotice(getFirebaseErrorMessage(error.code));
        setLoading(false); // Set loading state to false
      });
  };
  const submitGoogle = async () => {
    await loginWithGoogle();
    navigate('/universities');
  };

  return (
    <div className={styles.container}>
      <div className="grid" />
      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '20px',
          alignItems: 'center'
        }}
      >
        <h1 className={styles.logo} onClick={() => navigate('/')}>
          StudyShare
        </h1>
        <h2 className={styles.title}>Sign up</h2>
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

        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
        />

        <p>{notice}</p>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} />}
        >
          {!loading ? 'Sign Up' : ''}
        </Button>
        <div className={styles.linksWrapper}>
          <p>
            Already have an account? &nbsp;
            <Link href="/login">Log in</Link>
          </p>
        </div>
        <Button onClick={submitGoogle}>Log In with Google</Button>
      </Paper>
    </div>
  );
}
