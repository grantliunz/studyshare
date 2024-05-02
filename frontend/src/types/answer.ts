import { Comment, ObjectId, Rating } from './assessment';

export type Answer = {
  _id: ObjectId;
  text: string;
  author: ObjectId;
  rating: Rating;
  comments: Comment[];
  isAnonymous?: boolean;
};

export type CreateAnswerDTO = {
  text: string;
  author: ObjectId;
  rating: Rating;
  comments: ObjectId[];
  isAnonymous?: boolean;
};
