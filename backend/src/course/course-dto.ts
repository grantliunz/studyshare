import { Types } from 'mongoose';
import { CreateAssessmentDTO } from '../assessment/assessment-dto';

export interface CourseDTO {
  Name: string;
  Code?: string;
  University: string;
  Assessments?: CreateAssessmentDTO[] | Types.ObjectId[];
}
