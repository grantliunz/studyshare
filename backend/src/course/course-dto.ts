import { CreateAssessmentDTO } from "../assessment/assessment-dto";

export interface CourseDTO {
    Name: string;
    Code?: string;
    Assessments?: CreateAssessmentDTO[];
  }
  