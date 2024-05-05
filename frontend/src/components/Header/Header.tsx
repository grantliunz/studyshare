import styles from './Header.module.css';
import notificationIcon from '../../assets/icons/notification.svg';
import { useAuth } from '../../contexts/UserContext';
import { Badge, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationsWindow from '../NotificationsWindow/NotificationsWindow';
import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';
import Avatar, { genConfig } from 'react-nice-avatar';


export default function Header() {
  const { user, userDb } = useAuth();
  const navigate = useNavigate();

  const [openNotifications, setOpenNotifications] = useState(false);
  const [noNotifications, setNoNotifications] = useState(0);

  const onClick = () => {
    navigate('/login');
  };

  const onClickProfile = () => {
    navigate('/profile');
  }

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
      <div className={styles.breadcrumbContainer}>
        <BreadCrumbs />
      </div>
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
                style={{ cursor: 'pointer' }}
              />
              {userDb && (
                <NotificationsWindow
                  open={openNotifications}
                  onClose={closeNotificationsWindow}
                  updateNumberOfNotifications={setNoNotifications}
                />
              )}
            </Badge>
            <div className={styles.profileIcon} onClick = {onClickProfile} style={{cursor: 'pointer'}}>
              <Avatar
                style={{ width: '50px', height: '50px' }}
                {...genConfig(user.email)}
              />
            </div>
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
