import { Types } from "mongoose";
import { CreateCommentDTO } from "../comment/comment-dto";
import { CreateRatingDTO } from "../rating/rating-dto";


export interface CreateAnswerDTO {
    AnswerText: string;
    AnswerImage?: string;
    Rating?: CreateRatingDTO | Types.ObjectId;
    Comments?: CreateCommentDTO[] | Types.ObjectId[];
    Author: Types.ObjectId;
  }
  