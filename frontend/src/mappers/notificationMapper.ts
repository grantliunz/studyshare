import { NotificationDTO } from '@shared/types/models/notification/NotificationDTO';
import { Mapper } from '../mappers/mapper';

const mapGetNotifications: Mapper<NotificationDTO[]> = (
  data: any
): NotificationDTO[] => {
  return data.map(
    (item: any): NotificationDTO => ({
      id: item.id,
      entityID: item.entityID,
      commenterName: item.commenterName,
      entitySummary: item.entitySummary,
      entityUrl: item.entityUrl,
      timestamp: new Date(item.timestamp),
      timedifference: item.timedifference
    })
  );
};

export { mapGetNotifications };
