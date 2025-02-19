import Button from '@mui/material/Button';
import styles from './Landing.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { Paper } from '@mui/material';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const onClick = () => {
    navigate('/universities');
  };
  useEffect(() => {
    if (user) {
      onClick();
    }
  }, [user]);

  return (
    <div className={styles.pageWrapper}>
      <div className="grid" />
      <Paper elevation={20} className={styles.container} sx={{}}>
        <h1 className={styles.title}>StudyShare</h1>
        <p className={styles.description}>
          A platform for students to collaborate on past assessments <br /> and
          elevate their learning
        </p>
        <Button
          onClick={onClick}
          variant="contained"
          color="secondary"
          className={styles.startButton}
          style={{
            fontSize: '1.5rem',
            textTransform: 'none'
          }}
          sx={{
            borderRadius: '5px',
            boxShadow: '10'
          }}
        >
          Get Started
        </Button>
        <p className={styles.loginButton}>
          Already have an account? &nbsp;
          <Link to="/login">Log in</Link>
        </p>
      </Paper>
    </div>
  );
}
