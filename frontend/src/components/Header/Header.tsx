import styles from './Header.module.css';
import notificationIcon from '../../assets/icons/notification.svg';
import { useAuth } from '../../contexts/UserContext';
import { Badge, Button, Grow } from '@mui/material';
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
  };

  const openNotificationsWindow = () => {
    setOpenNotifications(true);
  };

  const closeNotificationsWindow = () => {
    setOpenNotifications(false);
  };

  // User avatar configuration
  const config = (email: string) => {
    const avatarConfig = genConfig(email || '');
    if (avatarConfig.hairStyle === 'womanLong') {
      avatarConfig.hairStyle = 'womanShort';
    } else if (avatarConfig.hairStyle === 'thick') {
      avatarConfig.hairStyle = 'normal';
    }
    return avatarConfig;
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
              <Grow in={true} style={{ transformOrigin: 'center' }}>
                <img
                  onClick={openNotificationsWindow}
                  src={notificationIcon}
                  alt="Notification"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e: any) =>
                    (e.target.style.transform = 'scale(1.1)')
                  }
                  onMouseOut={(e: any) =>
                    (e.target.style.transform = 'scale(1)')
                  }
                />
              </Grow>
              {userDb && (
                <NotificationsWindow
                  open={openNotifications}
                  onClose={closeNotificationsWindow}
                  updateNumberOfNotifications={setNoNotifications}
                />
              )}
            </Badge>
            <div
              className={styles.profileIcon}
              onClick={onClickProfile}
              style={{ cursor: 'pointer' }}
            >
              <Avatar
                style={{ width: '50px', height: '50px' }}
                {...config(userDb?.name || '')}
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
