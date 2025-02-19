import { Types } from 'mongoose';
import { CreateAssessmentDTO } from '../assessment/assessment-dto';

export interface CourseDTO {
  name: string;
  code?: string;
  university: Types.ObjectId;
  assessments?: CreateAssessmentDTO[] | Types.ObjectId[];
}
