import { Comment } from '../types/assessment';
import { Mapper } from './mapper';

const commentMapper: Mapper<Comment> = (data: any): Comment => {
  return {
    text: data.text,
    author: data.author,
    rating: data.rating,
    createdAt: new Date(data.createdAt)
  };
};

export { commentMapper };
