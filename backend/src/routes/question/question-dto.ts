import { Types } from 'mongoose';

export interface CreateQuestionDTO {
  number: string[];
  text: string;
  author: Types.ObjectId;
  answers: Types.ObjectId[];
  watchers: Types.ObjectId[];
  comments: Types.ObjectId[];
  latestContributor: Types.ObjectId;
  isAnonymous: boolean;
}
