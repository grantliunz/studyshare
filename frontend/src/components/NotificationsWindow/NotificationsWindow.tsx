import React, { useEffect } from 'react';
import { Button, Fade, Modal } from '@mui/material';
import styles from './NotificationsWindow.module.css';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import NotificationCard from './NotificationCard/NotificationCard';
import useGet from '../../hooks/useGet';
import API from '../../util/api';
import { mapGetNotifications } from '../../mappers/notificationMapper';
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
  const { data: notifications } = useGet<NotificationDTO[]>(
    API.getNotifications + '/66324cae9cbb1e945fe6b944',
    null,
    mapGetNotifications
  );

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
        {notifications.slice(0, 8).map((notificationObj) => (
          <NotificationCard
            key={notificationObj.questionID} // notificationObj.id is somehow not unique?
            notification={notificationObj}
          />
        ))}
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
      </div>
    </Modal>
  );
}
