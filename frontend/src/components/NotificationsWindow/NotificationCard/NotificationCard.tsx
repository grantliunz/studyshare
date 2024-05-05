import { Avatar, Button } from '@mui/material';
import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import styles from './NotificationCard.module.css';
import { useNavigate } from 'react-router-dom';
import { UserDTO, WatchListType } from '@shared/types/models/user/user';
import usePut from '../../../hooks/usePut';
import { useAuth } from '../../../contexts/UserContext';
import API from '../../../util/api';
import { WatchlistEntry } from '@shared/types/models/watchlist/WatchlistEntry';
import { AxiosError } from 'axios';

interface NotificationCardProps {
  notification: NotificationDTO;
  onClose: () => void;
  refreshNotifications: () => void;
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
  notification,
  onClose,
  refreshNotifications
}: NotificationCardProps) {
  const navigate = useNavigate();
  const { userDb, refreshUserDb } = useAuth();
  const { putData: putUser } = usePut<Partial<UserDTO>, UserDTO>(
    `${API.updateUser}/${userDb?._id}`
  );

  async function navigateToQuestion(
    questionUrl: string,
    entityID: string,
    questionId: string
  ) {
    onClose();
    const watchedItems = userDb?.watchList as WatchlistEntry[] | undefined;
    // Update the last viewed time of the item
    const watchedItemIndex = watchedItems!.findIndex(
      (watchedItem) => watchedItem.watchedId === entityID
    );

    watchedItems![watchedItemIndex] = {
      ...watchedItems![watchedItemIndex],
      lastViewed: new Date()
    };
    const res = await putUser({
      watchList: watchedItems
    });

    if (res instanceof AxiosError) {
      console.error((res.response?.data as { error: string }).error);
      return;
    }
    // refreshUserDb();
    refreshNotifications();
    const quest = questionId != '' ? questionId : entityID;
    navigate(questionUrl, { state: { quest } });
  }
  return (
    <Button
      key={notification.id} // Use the id as the key
      onClick={() => {
        navigateToQuestion(
          notification.entityUrl,
          notification.entityID,
          notification.questionId ?? ''
        );
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
      <Avatar className={styles.avatar} />
      <div>
        <p className={styles.notificationText}>
          <b>{notification.authorName}</b>
          {notification.entityType === WatchListType.QUESTION ? (
            <>
              {' responded to your watchlisted question: "' +
                notification.entitySummary +
                '"'}
            </>
          ) : (
            <>
              {' created a new question in your watchlisted assessment: "' +
                notification.entitySummary +
                '"'}
            </>
          )}
        </p>
        <p className={styles.timestampText}>
          {getTimeDifference(notification.timestamp)}
        </p>
      </div>
    </Button>
  );
}
