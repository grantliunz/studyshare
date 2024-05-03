import { Answer } from '../answer/answer';
import { ObjectId } from '../assessment/assessment';
import { UserDb } from '../user/user';

export type Question = {
  _id: ObjectId;
  assessment: ObjectId;
  number: string[];
  text: string;
  author: UserDb;
  answers: Answer[];
  watchers: ObjectId[]; // might need to change to a user object
  comments: Comment[];
  latestContributor: ObjectId;
};

export type CreateQuestionDTO = {
  number: string[];
  text: string;
  author: ObjectId;
  answers: ObjectId[];
  watchers: ObjectId[]; // might need to change to a user object
  comments: ObjectId[];
};
