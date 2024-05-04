import { Types } from 'mongoose';

export interface CreateQuestionDTO {
  number: string[];
  versions: {
    text: string;
    author: Types.ObjectId;
    createdAt: Date;
  }[];
  answers: Types.ObjectId[];
  watchers: Types.ObjectId[];
  reporters: Types.ObjectId[];
  comments: Types.ObjectId[];
  latestContributor: Types.ObjectId;
  isAnonymous: boolean;
}
