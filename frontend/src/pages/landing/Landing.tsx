import Button from '@mui/material/Button';
import styles from './Landing.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import { Paper } from '@mui/material';

export default function Landing() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const onClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className="grid" />
      <h1 className={styles.title}>StudyShare</h1>
      <Paper className={styles.description}>
        The collaborative platform where students come together to share,
        <br />
        review, and elevate their exam preparation.
      </Paper>
      <Button
        onClick={onClick}
        variant="contained"
        color="secondary"
        className={styles.button}
        style={{
          fontSize: '1.5rem'
        }}
      >
        Get Started
      </Button>
      {user && <Button onClick={logout}>Logout (temporary)</Button>}
    </div>
  );
}
