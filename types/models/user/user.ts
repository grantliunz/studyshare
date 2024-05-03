import { Answer } from '../answer/answer';
import { ObjectId } from '../assessment/assessment';
import { Question } from '../question/question';
import { WatchlistEntry } from '../watchlist/WatchlistEntry';

export type UserDisplayDTO = {
  name: string;
};

// temporary type until we finalise the user type
export type UserDb = {
  _id: string;
  authId: string;
  name: string;
  email: string;
  questions: Question[];
  answers: Answer[];
  watchList: WatchlistEntry[];
  upvotedAnswers: Answer[];
  downvotedAnswers: Answer[];
  upvotedComments: Comment[];
  downvotedComments: Comment[];
  createdAt: Date;
};

// type that does not contain populated nested objects
export type UserDbLazy = {
  _id: string;
  authId: string;
  name: string;
  email: string;
  questions: ObjectId[];
  answers: ObjectId[];
  watchList: WatchlistEntry[];
  upvotedAnswers: ObjectId[];
  downvotedAnswers: ObjectId[];
  upvotedComments: ObjectId[];
  downvotedComments: ObjectId[];
  createdAt: Date;
};

// temporary type until we finalise the user type
export type UserDTO = {
  _id: ObjectId;
  authId: string;
  name: string;
  email: string;
  questions: ObjectId[];
  answers: ObjectId[];
  watchList: WatchlistEntry[];
  upvotedAnswers: ObjectId[];
  downvotedAnswers: ObjectId[];
  upvotedComments: ObjectId[];
  downvotedComments: ObjectId[];
};

export type PostUser = {
  authId: string;
  name: string;
  email: string;
};
