import { Answer } from '../answer/answer';
import { ObjectId } from '../assessment/assessment';
import { UserDb } from '../user/user';

export type Question = {
  _id: ObjectId;
  assessment: ObjectId;
  versions: QuestionVersionEntry[];
  number: string[];
  answers: Answer[];
  watchers: ObjectId[]; // might need to change to a user object
  reporters: ObjectId[];
  comments: Comment[];
  latestContributor: ObjectId;
  createdAt: Date;
};

export type CreateQuestionDTO = {
  number: string[];
  versions: CreateQuestionVersionEntryDTO[];
  answers: ObjectId[];
  watchers: ObjectId[]; // might need to change to a user object
  reporters: ObjectId[];
  comments: ObjectId[];
  latestContributor: ObjectId;
};

export type CreateQuestionVersionEntryDTO = {
  text: string;
  author: ObjectId;
  createdAt: Date;
  isAnonymous: boolean;
};

export type QuestionVersionEntry = {
  text: string;
  author: UserDb;
  createdAt: Date;
  isAnonymous: boolean;
};

export type QuestionLazy = {
  _id: ObjectId;
  assessment: ObjectId;
  number: string[];
  versions: { text: string; author: ObjectId; createdAt: Date }[];
  answers: ObjectId[];
  watchers: ObjectId[];
  comments: ObjectId[];
  latestContributor: ObjectId;
};