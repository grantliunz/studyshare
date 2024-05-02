import { Types } from 'mongoose';
import { CreateQuestionDTO } from '../question/question-dto';
import { CreateAnswerDTO } from '../answer/answer-dto';
import { WatchlistEntry } from '@shared/types/models/watchlist/WatchlistEntry';
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

export interface UpdateUserDTO extends Document {
  name?: string;
  email?: string;
  questions?: Types.ObjectId[] | CreateQuestionDTO[];
  answers?: Types.ObjectId[] | CreateAnswerDTO[];
  watchList?: WatchlistEntry[];
}
