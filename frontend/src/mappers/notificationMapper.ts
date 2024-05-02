import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import { Mapper } from '../mappers/mapper';

const mapGetNotifications: Mapper<NotificationDTO[]> = (
  data: any
): NotificationDTO[] => {
  return data.map(
    (item: any): NotificationDTO => ({
      id: item.id,
      questionID: item.questionID,
      commenterName: item.commenterName,
      questionSummary: item.questionSummary,
      questionUrl: item.questionUrl,
      timestamp: new Date(item.timestamp),
      timedifference: item.timedifference
    })
  );
};

export { mapGetNotifications };
