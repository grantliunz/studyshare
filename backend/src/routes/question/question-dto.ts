import { Types } from 'mongoose';
import { CreateCommentDTO } from '../comment/comment-dto';

export interface CreateQuestionDTO {
  number: string;
  content?: {
    text: string;
    author: Types.ObjectId;
    timestamp: string;
    answers: Types.ObjectId[];
    watchers: Types.ObjectId[];
    comments: Types.ObjectId[];
  };
  subquestions?: Types.ObjectId[];

  // QuestionNumber: string;
  // Image: string[];
  // QuestionText: string;
  // Answers?: Types.ObjectId[];
  // Watchers?: Types.ObjectId[];
  // Comments?: CreateCommentDTO[] | Types.ObjectId[];
  // Author: Types.ObjectId;
}
