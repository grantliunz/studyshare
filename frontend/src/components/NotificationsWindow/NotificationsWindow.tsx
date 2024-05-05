import { useEffect } from 'react';
import { Button, Modal } from '@mui/material';
import styles from './NotificationsWindow.module.css';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import NotificationCard from './NotificationCard/NotificationCard';
import useGet from '../../hooks/useGet';
import API from '../../util/api';
import { mapGetNotifications } from '../../mappers/notificationMapper';
import { useAuth } from '../../contexts/UserContext';
interface NotificationsWindowProps {
  open: boolean;
  onClose: () => void;
  updateNumberOfNotifications: (num: number) => void;
}
export default function NotificationsWindow({
  open,
  onClose,
  updateNumberOfNotifications
}: NotificationsWindowProps) {
  const { userDb } = useAuth();
  const { data: notifications, refresh: refreshNotifications } = useGet<
    NotificationDTO[]
  >(API.getNotifications + `/${userDb?._id}`, null, mapGetNotifications);

  useEffect(() => {
    if (notifications) {
      updateNumberOfNotifications(notifications.length);
    }
  }, [notifications, updateNumberOfNotifications]);

  if (!notifications) {
    return null;
  }

  function navigateToProfilePage() {
    //TODO: navigate to profile page
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p>No notifications</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 8).map(
              (notificationObj) => (
                console.log(notificationObj),
                (
                  <NotificationCard
                    key={notificationObj.entityID} // notificationObj.id is somehow not unique?
                    notification={notificationObj}
                    onClose={() => onClose()}
                    refreshNotifications={() => refreshNotifications()}
                  />
                )
              )
            )}
            {notifications.length > 8 && (
              <Button
                onClick={navigateToProfilePage} // You missed the function invocation here
                variant="contained"
                sx={{
                  borderRadius: '5px',
                  boxShadow: 0
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'black',
                  textTransform: 'none',
                  margin: '5px',
                  padding: '2px',
                  width: '100%'
                }}
              >
                view more notifications
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
