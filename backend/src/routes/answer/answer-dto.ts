import { Types } from 'mongoose';
import { CreateCommentDTO } from '../comment/comment-dto';
import { CreateRatingDTO } from '../rating/rating-dto';

export interface CreateAnswerDTO {
  answerText: string;
  answerImage?: string;
  rating?: CreateRatingDTO | Types.ObjectId;
  comments?: CreateCommentDTO[] | Types.ObjectId[];
  author: Types.ObjectId;
}
