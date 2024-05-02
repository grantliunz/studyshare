import { UserDb } from './user';

export type ObjectId = string;

export type Question = {
  _id: string;
  assessment: string;
  number: string[];
  text: string;
  author: UserDb;
  answers: Answer[];
  watchers: string[]; // might need to change to a user object
  comments: Comment[];
};

export type Answer = {
  _id: string;
  text: string;
  author: string;
  rating: Rating;
  comments: Comment[];
  isAnonymous?: boolean;
};

export type Comment = {
  text: string;
  author: string;
  rating: Rating;
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
  questions: QuestionGET[];
};

export type QuestionGET = {
  _id: ObjectId;
  assessment: ObjectId;
  number: string[];
  text: string;
  author: ObjectId;
  answers: ObjectId[];
  watchers: ObjectId[];
  comments: ObjectId[];
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
