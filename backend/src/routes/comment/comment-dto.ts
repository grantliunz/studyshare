import { Types } from 'mongoose';
import { CreateUserDTO } from '../user/user-dto';
import { CreateRatingDTO } from '../rating/rating-dto';

export interface CreateCommentDTO extends Document {
  Text: string;
  PreviousComment: Types.ObjectId;
  Author: CreateUserDTO | Types.ObjectId;
  Rating: CreateRatingDTO | Types.ObjectId;
}
