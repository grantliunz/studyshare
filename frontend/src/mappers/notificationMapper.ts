import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import { Mapper } from '../mappers/mapper';

const mapGetNotifications: Mapper<NotificationDTO[]> = (
  data: any
): NotificationDTO[] => {
  return data.map((item: any) => ({
    questionID: item.questionID,
    commenterName: item.commenterName,
    questionSummary: item.questionSummary,
    timestamp: new Date(item.timestamp)
  }));
};

export { mapGetNotifications };
