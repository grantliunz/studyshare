import { Course } from '@shared/types/models/course/course';
import { Mapper } from '../mappers/mapper';

const mapGetCoursesData: Mapper<Course[]> = (data: any): Course[] => {
  // Assuming the API response data is an array of objects
  return data.map((courseData: any) => ({
    id: courseData._id,
    code: courseData.code,
    name: courseData.name,
    assessments: courseData.assessments,
    createdAt: new Date(courseData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
};

const mapGetCourseData: Mapper<Course> = (data: any): Course => {
  return {
    id: data._id,
    code: data.code,
    name: data.name,
    assessments: data.assessments,
    createdAt: new Date(data.createdAt.seconds * 1000) // Convert seconds to milliseconds
  };
};

export { mapGetCoursesData, mapGetCourseData };
