import { Types } from 'mongoose';
import { CreateQuestionDTO } from '../question/question-dto';
import { CreateAnswerDTO } from '../answer/answer-dto';
import { CreateCommentDTO } from '../comment/comment-dto';

export interface CreateUserDTO extends Document {
  authId: string;
  name: string;
  email: string;
  questions: CreateQuestionDTO[] | Types.ObjectId[];
  answers: CreateAnswerDTO[] | Types.ObjectId[];
  watchList: CreateQuestionDTO[] | Types.ObjectId[];
  upvotedAnswers: CreateAnswerDTO[] | Types.ObjectId[];
  downvotedAnswers: CreateAnswerDTO[] | Types.ObjectId[];
  upvotedComments: CreateCommentDTO[] | Types.ObjectId[];
  downvotedComments: CreateCommentDTO[] | Types.ObjectId[];
}
