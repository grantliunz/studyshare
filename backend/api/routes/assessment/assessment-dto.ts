import { Types } from 'mongoose';
import { CreateQuestionDTO } from '../question/question-dto';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';

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
