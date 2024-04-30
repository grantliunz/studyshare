import { Schema } from 'mongoose';
import { CreateUserDTO } from '../user/user-dto';
import { CreateRatingDTO } from '../rating/rating-dto';

export interface CreateCommentDTO extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  rating: {
    upvotes: number;
    downvotes: number;
  };
}
