import { Types } from 'mongoose';
import { CreateCommentDTO } from '../comment/comment-dto';

export interface CreateQuestionDTO {
  QuestionNumber: string;
  Image: string[];
  QuestionText: string;
  Answers?: Types.ObjectId[];
  Watchers?: Types.ObjectId[];
  Comments?: CreateCommentDTO[] | Types.ObjectId[];
  Author: Types.ObjectId;
}
