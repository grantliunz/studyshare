import { Question } from '../question/question';

export type ObjectId = string;

export type Comment = {
  text: string;
  author: ObjectId;
  rating: Rating;
  createdAt: Date;
  isAnonymous: boolean;
};

export type CreateCommentDTO = {
  text: string;
  author: ObjectId;
  rating: Rating;
  isAnonymous: boolean;
};

export type Rating = {
  upvotes: number;
  downvotes: number;
};

export type AssessmentGET = {
  courseId: ObjectId;
  _id?: ObjectId;
  name?: string;
  type: AssessmentType;
  number?: number;
  year: number;
  semester: SemesterType;
  questions: QuestionLazy[];
};

export type QuestionLazy = {
  _id: ObjectId;
  assessment: ObjectId;
  number: string[];
  text: string;
  author: ObjectId;
  answers: ObjectId[];
  watchers: ObjectId[];
  comments: ObjectId[];
  latestContributor: ObjectId;
};

export type Assessment = {
  courseId: string;
  _id?: string;
  name?: string;
  type: AssessmentType;
  number?: number;
  year: number;
  semester: SemesterType;
  questions: Question[];
};

export enum AssessmentType {
  EXAM = 'Exam',
  TEST = 'Test',
  LAB = 'Lab',
  ASSIGNMENT = 'Assignment',
  OTHER = 'Other'
}

export enum SemesterType {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
  OTHER = 'Other'
}
