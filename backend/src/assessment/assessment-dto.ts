import { Types } from "mongoose";
import { AssessmentType, SemesterType } from "./assessment-enums";
import { CreateQuestionDTO } from "../question/question-dto";
export interface CreateAssessmentDTO {
    AssessmentType: AssessmentType;
    Number?: number;
    Year: number;
    Semester: SemesterType;
    Questions?: CreateQuestionDTO[] | Types.ObjectId[];
  }
  