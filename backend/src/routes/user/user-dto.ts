import { Types } from 'mongoose';
import { CreateQuestionDTO } from '../question/question-dto';
import { CreateAnswerDTO } from '../answer/answer-dto';

export interface CreateUserDTO extends Document {
  name: string;
  email?: string;
  questions: CreateQuestionDTO[] | Types.ObjectId[];
  answers: CreateAnswerDTO[] | Types.ObjectId[];
  watchList: CreateUserDTO[] | Types.ObjectId[];
}
