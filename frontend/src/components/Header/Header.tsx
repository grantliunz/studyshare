import styles from './Header.module.css';
import profileIcon from '../../assets/icons/profile.svg';
import notificationIcon from '../../assets/icons/notification.svg';
import { useAuth } from '../../contexts/UserContext';
import { Badge, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationsWindow from '../NotificationsWindow/NotificationsWindow';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openNotifications, setOpenNotifications] = useState(false);
  const [noNotifications, setNoNotifications] = useState(0);

  const onClick = () => {
    navigate('/login');
  };

  const openNotificationsWindow = () => {
    setOpenNotifications(true);
  };

  const closeNotificationsWindow = () => {
    setOpenNotifications(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title} onClick={() => navigate('/')}>
        StudyShare
      </h1>
      <div className={styles.rightContainer}>
        {user ? (
          <>
            <Badge
              badgeContent={noNotifications}
              sx={{
                '& .MuiBadge-badge': {
                  color: 'white',
                  backgroundColor: 'red'
                }
              }}
            >
              <img
                onClick={openNotificationsWindow}
                src={notificationIcon}
                alt="Notification"
              />
              <NotificationsWindow
                open={openNotifications}
                onClose={closeNotificationsWindow}
                updateNumberOfNotifications={setNoNotifications}
              />
            </Badge>
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
