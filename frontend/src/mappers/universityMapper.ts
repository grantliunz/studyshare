import { Mapper } from '../mappers/mapper';
import { University } from '../types/types';
const mapGetUniversitiesData: Mapper<University[]> = (
  data: any
): University[] => {
  // Assuming the API response data is an array of objects
  return data.map((universityData: any) => ({
    id: universityData._id,
    name: universityData.Name,
    image: universityData.Image,
    courses: universityData.Courses,
    createdAt: new Date(universityData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
};
const mapGetUniversityData: Mapper<University> = (data: any): University => {
  return {
    id: data._id,
    name: data.Name,
    image: data.Image,
    courses: data.Courses,
    createdAt: new Date(data.createdAt.seconds * 1000) // Convert seconds to milliseconds
  };
};

export { mapGetUniversitiesData, mapGetUniversityData };
