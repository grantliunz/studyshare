import { Types } from "mongoose";
import { CreateQuestionDTO } from "../question/question-dto";
import { CreateAnswerDTO } from "../answer/answer-dto";
import { CreateRewardDTO } from "../reward/reward-dto";


export interface CreateUserDTO {
    Name: string;
    Questions: CreateQuestionDTO[] | Types.ObjectId[];
    Answers: CreateAnswerDTO[] | Types.ObjectId[];
    WatchList: CreateUserDTO[] | Types.ObjectId[];
    Rewards: CreateRewardDTO[] | Types.ObjectId[];
  }
  