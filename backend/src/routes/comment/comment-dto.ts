import { Types } from 'mongoose';

export interface CreateCommentDTO extends Document {
  text: string;
  author: Types.ObjectId;
  rating: {
    upvotes: number;
    downvotes: number;
  };
  createdAt: Date;
}
