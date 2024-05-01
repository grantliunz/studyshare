import { Answer, Question, Comment } from './assessment';

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
