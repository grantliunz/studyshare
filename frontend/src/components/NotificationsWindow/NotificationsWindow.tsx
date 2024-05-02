import { Button, Modal } from '@mui/material';
import styles from './NotificationsWindow.module.css';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import NotificationCard from './NotificationCard/NotificationCard';
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
  var notifications = fakeNotificationData();
  notifications = notifications.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  updateNumberOfNotifications(notifications.length);
  function navigateToProfilePage() {
    //TODO: navigate to profile page
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        {notifications.slice(0, 8).map((notificationObj) => (
          <NotificationCard notification={notificationObj} />
        ))}
        {notifications.length > 8 && (
          <Button
            onClick={() => {
              navigateToProfilePage;
            }}
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

function fakeNotificationData(): NotificationDTO[] {
  // remove when backend is connected
  return [];
}
