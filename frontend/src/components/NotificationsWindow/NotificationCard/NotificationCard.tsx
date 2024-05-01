import { Avatar, Button } from '@mui/material';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import styles from './NotificationCard.module.css';
import { useNavigate } from 'react-router-dom';

interface NotificationCardProps {
  notification: NotificationDTO;
}

function getTimeDifference(timestamp: Date) {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - timestamp.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

export default function NotificationCard({
  notification
}: NotificationCardProps) {
  const navigate = useNavigate();

  function navigateToQuestion(questionID: string) {
    // TODO: navigate to question page
  }
  return (
    <Button
      key={notification.id} // Use the id as the key
      onClick={() => {
        navigateToQuestion(notification.questionID);
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
        padding: '2px'
      }}
    >
      <Avatar className={styles.avatar} /> {/**use commenter's avatar here */}
      <div>
        <p className={styles.notificationText}>
          <b>{notification.commenterName}</b>
          {' responded to your watchlisted question: "' +
            notification.questionSummary +
            '"'}
        </p>
        <p className={styles.timestampText}>
          {getTimeDifference(notification.timestamp)}
        </p>
      </div>
    </Button>
  );
}
