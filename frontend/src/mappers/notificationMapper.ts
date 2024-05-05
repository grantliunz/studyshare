import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import { Mapper } from '../mappers/mapper';

const mapGetNotifications: Mapper<NotificationDTO[]> = (
  data: any
): NotificationDTO[] => {
  return data.map(
    (item: any): NotificationDTO => ({
      id: item.id,
      entityID: item.entityID,
      authorName: item.authorName,
      entitySummary: item.entitySummary,
      entityUrl: item.entityUrl,
      timestamp: new Date(item.timestamp),
      timeDifference: item.timeDifference,
      entityType: item.entityType,
      questionId: item.questionId || undefined
    })
  );
};

export { mapGetNotifications };
