import { Types } from 'mongoose';

export interface CreateAnswerDTO {
  text: string;
  rating: {
    upvotes: number;
    downvotes: number;
  };
  comments: [Types.ObjectId];
  author: Types.ObjectId;
  isAnonymous?: boolean;
}
