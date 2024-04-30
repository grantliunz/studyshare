import { Types } from 'mongoose';

export interface CreateQuestionDTO {
  assessment: Types.ObjectId;
  number: string[];
  text: string;
  author: Types.ObjectId;
  answers: Types.ObjectId[];
  watchers: Types.ObjectId[];
  comments: Types.ObjectId[];
}
