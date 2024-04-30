import styles from './Header.module.css';
import profileIcon from '../../assets/icons/profile.svg';
import notificationIcon from '../../assets/icons/notification.svg';
import { useAuth } from '../../contexts/UserContext';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <Link
        to="/"
        className={styles.title}
        style={{
          textDecoration: 'none',
          display: 'inline-block',
          lineHeight: 'normal',
          marginTop: '1rem',
          marginBottom: '1rem'
        }}
      >
        StudyShare
      </Link>
      <div className={styles.rightContainer}>
        {user ? (
          <>
            <img src={notificationIcon} alt="Notification" />
            <img src={profileIcon} alt="Profile" />
          </>
        ) : (
          <div>
            <Button
              variant="contained"
              onClick={onClick}
              style={{
                backgroundColor: 'white',
                color: 'black'
              }}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
