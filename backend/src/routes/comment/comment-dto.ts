import { Schema } from 'mongoose';
import { CreateUserDTO } from '../user/user-dto';

export interface CreateCommentDTO extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  rating: {
    upvotes: number;
    downvotes: number;
  };
}
