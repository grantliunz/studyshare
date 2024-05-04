import { VoteDirection } from '../../enums/VoteDirection';
import { Comment, ObjectId, Rating } from '../assessment/assessment';

export type Answer = {
  _id: ObjectId;
  text: string;
  author: ObjectId;
  rating: Rating;
  comments: Comment[];
  isAnonymous?: boolean;
  createdAt: Date;
};

export type CreateAnswerDTO = {
  text: string;
  author: ObjectId;
  rating: Rating;
  comments: ObjectId[];
  isAnonymous?: boolean;
};

export type MakeVoteDTO = {
  userId: ObjectId;
  oldVoteDirection: VoteDirection;
  newVoteDirection: VoteDirection;
};
