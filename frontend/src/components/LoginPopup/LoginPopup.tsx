import { Modal } from '@mui/material';
import styles from './LoginPopup.module.css';
import { useAuth } from '../../contexts/UserContext';
import { Paper, CircularProgress } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { useState } from 'react';
import { getFirebaseErrorMessage } from '../../util/firebase';

interface LoginPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function LoginPopup({ open, setOpen }: LoginPopupProps) {
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading state
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    login(email, password)
      .then(() => {
        setOpen(false);
        setLoading(false); // Set loading state to false on success
      })
      .catch((error: FirebaseError) => {
        setNotice(getFirebaseErrorMessage(error.code));
        setLoading(false); // Set loading state to false on error
      });

    // Create a new
  };

  const submitGoogle = async () => {
    await loginWithGoogle();
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className={styles.modal}>
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
          <h1 className={styles.logo}>StudyShare</h1>
          <h2 className={styles.title}>Log in</h2>
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
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
            style={{
              marginTop: '20px',
              padding: '10px 50px'
            }}
          >
            {!loading ? 'Log in' : ''}
          </Button>
          <div className={styles.linksWrapper}>
            <div>
              Don't have an account?&nbsp;
              <Link href="/signup">Sign up</Link>
            </div>
            <Link href="#">Forgot password?</Link>
          </div>
          <Button onClick={submitGoogle}>Log In with Google</Button>
        </Paper>
      </div>
    </Modal>
  );
}
