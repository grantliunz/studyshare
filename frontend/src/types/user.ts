import { Answer, Comment, ObjectId, Question } from './assessment';

export type UserDisplayDTO = {
  name: string;
};

// temporary type until we finalise the user type
export type UserDb = {
  id: string;
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
  authId: string;
  id: ObjectId;
  name: string;
  email: string;
  questions: ObjectId[];
  answers: ObjectId[];
  watchList: ObjectId[];
  upvotedAnswers: ObjectId[];
  downvotedAnswers: ObjectId[];
  upvotedComments: ObjectId[];
  downvotedComments: ObjectId[];
};

export interface PostUser {
  authId: string;
  name: string;
  email: string;
}
