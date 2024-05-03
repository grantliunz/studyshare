import { ObjectId } from '../assessment/assessment';

export type University = {
  id: string;
  name: string;
  image: string;
  courses: ObjectId[];
  createdAt: Date;
};

export type PostUniversity = {
  name: string;
  courses?: { Name: string }[];
};
