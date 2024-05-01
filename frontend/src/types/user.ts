import { Answer, Comment, ObjectId, Question } from './assessment';

export type UserDisplayDTO = {
  name: string;
};

// temporary type until we finalise the user type
export type UserDB = {
  _id: string;
  authId: string;
  name: string;
  email: string;
  questions: Question[];
  answers: Answer[];
  watchList: Question[];
  upvotedAnswers: Answer[];
  downvotedAnswers: Answer[];
  upvotedComments: Comment[];
  downvotedComments: Comment[];
  createdAt: Date;
};

// temporary type until we finalise the user type
export type UserDTO = {
  _id: ObjectId;
  name: string;
  email: string;
  questions: ObjectId[];
  answers: ObjectId[];
  watchList: ObjectId[];
  rewards: ObjectId[];
};
