import { Mapper } from '../mappers/mapper';
import { Answer } from '@shared/types/models/answer/answer';
import { commentMapper } from './commentMapper';

const answerMapper: Mapper<Answer> = (data: any): Answer => {
  return {
    _id: data._id,
    text: data.text,
    author: data.author,
    rating: data.rating,
    comments: data.comments.map((comment: any) => commentMapper(comment)),
    isAnonymous: data.isAnonymous,
    createdAt: new Date(data.createdAt)
  };
};

export { answerMapper };
