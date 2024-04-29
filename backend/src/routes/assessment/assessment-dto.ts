import { Types } from 'mongoose';
import { AssessmentType, SemesterType } from './assessment-enums';
import { CreateQuestionDTO } from '../question/question-dto';
export interface CreateAssessmentDTO extends Document {
  type: AssessmentType;
  number?: number;
  year: number;
  semester: SemesterType;
  questions?: CreateQuestionDTO[] | Types.ObjectId[];
  course: string;
}
