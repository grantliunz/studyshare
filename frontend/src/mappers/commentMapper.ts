import { Comment } from '@shared/types/models/assessment/assessment';
import { Mapper } from './mapper';

const commentMapper: Mapper<Comment> = (data: any): Comment => {
  return {
    _id: data._id,
    answer: data.answer,
    text: data.text,
    author: data.author,
    rating: data.rating,
    createdAt: new Date(data.createdAt)
  };
};

export { commentMapper };
