import { Mapper } from '../mappers/mapper';
import { Course } from '../types/types';

const mapGetCoursesData: Mapper<Course[]> = (data: any): Course[] => {
  // Assuming the API response data is an array of objects
  return data.map((courseData: any) => ({
    id: courseData._id,
    Code: courseData.Code,
    Name: courseData.Name,
    Assessments: courseData.Assessments,
    createdAt: new Date(courseData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
};

const mapGetCourseData: Mapper<Course> = (data: any): Course => {
  return {
    id: data._id,
    Code: data.Code,
    Name: data.Name,
    Assessments: data.Assessments,
    createdAt: new Date(data.createdAt.seconds * 1000) // Convert seconds to milliseconds
  };
};

export { mapGetCoursesData, mapGetCourseData };
