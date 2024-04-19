import Button from '@mui/material/Button';
import styles from './Landing.module.css';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  // const { user, logout } = useAuth();
  const onClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>StudyShare</h1>
      <p>
        The collaborative platform where students come together to share,
        review, and elevate their exam preparation.
      </p>
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
    </div>
  );
}
