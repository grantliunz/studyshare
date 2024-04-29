export type Question = {
  number: string;
  content?: {
    text: string;
    answers: Answer[]; // temp
    watchers: string[]; // temp
    comments: string[]; // temp
    timestamp: string;
    author: string;
  };
  subquestions?: Question[];
};

export type Answer = {
  text?: string;
  author: string;
  rating: Rating;
  comments: Comment[];
  timestamp: string;
};

export type Comment = {
  text?: string;
  author: string;
  rating: Rating;
};

export type Rating = {
  id: string;
  upvotes: number;
  downvotes: number;
};

export type Assessment = {
  courseId: string;
  id: string;
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
