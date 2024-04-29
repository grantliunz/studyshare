import { CourseDTO } from '../course/course-dto';
import { Types } from 'mongoose';
export interface CreateUniversityDTO {
  name: string;
  courses: CourseDTO[] | Types.ObjectId[];
}
