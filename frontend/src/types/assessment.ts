export type Question = {
  number: string;
  content?: {
    image?: string;
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
  image?: string;
  text?: string;
  author: string;
  rating: Rating;
  comments: Comment[];
  timestamp: string;
};

export type Comment = {
  image?: string;
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
  type: 'Exam' | 'Test' | 'Lab' | 'Assignment' | 'Other';
  number?: number;
  year: number;
  semester: 'First' | 'Second' | 'Third' | 'Other';
  questions: Question[];
};
