import { Answer, Question } from './assessment';

export type UserDisplayDTO = {
  name: string;
};

// temporary type until we finalise the user type
export type User = {
  _id: string;
  name: string;
  email: string;
  questions: Question[];
  answers: Answer[];
  watchList: Question[];
  rewards: any[];
};
