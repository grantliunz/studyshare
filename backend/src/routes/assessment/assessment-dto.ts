import { Types } from 'mongoose';
import { AssessmentType, SemesterType } from './assessment-enums';
import { CreateQuestionDTO } from '../question/question-dto';

export interface CreateAssessmentDTO extends Document {
  type: AssessmentType;
  name?: string;
  number?: number;
  year: number;
  semester: SemesterType;
  questions?: CreateQuestionDTO[] | Types.ObjectId[];
  course: string;
  userId: Types.ObjectId;
  latestContributor: Types.ObjectId;
  newestQuestion: Types.ObjectId | null;
}
