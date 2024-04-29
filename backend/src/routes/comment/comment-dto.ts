import { Types } from 'mongoose';
import { CreateUserDTO } from '../user/user-dto';
import { CreateRatingDTO } from '../rating/rating-dto';

export interface CreateCommentDTO extends Document {
  text: string;
  previousComment: Types.ObjectId;
  author: CreateUserDTO | Types.ObjectId;
  rating: CreateRatingDTO | Types.ObjectId;
}
