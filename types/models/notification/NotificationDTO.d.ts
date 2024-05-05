import { WatchListType } from "../user/user";
import { Types } from 'mongoose';

export type NotificationDTO = {
  id: string;
  entityID: string;
  authorId: Types.ObjectId;
  authorName: string;
  entitySummary: string;
  entityUrl: string;
  timeDifference: number;
  timestamp: Date;
  entityType: WatchListType;
  questionId?: string;
};
