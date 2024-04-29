import { CourseDTO } from '../course/course-dto';
import { Types } from 'mongoose';
export interface CreateUniversityDTO {
  Name: string;
  Courses: CourseDTO[] | Types.ObjectId[];
}
