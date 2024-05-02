import { WatchlistEntry } from '@shared/types/models/watchlist/WatchlistEntry';
import { Answer } from './answer';
import { Comment, ObjectId } from './assessment';
import { Question } from './question';

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
  authId: string;
  _id: ObjectId;
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

export interface PostUser {
  authId: string;
  name: string;
  email: string;
}
