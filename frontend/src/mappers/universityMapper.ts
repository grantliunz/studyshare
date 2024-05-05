import { University } from '@shared/types/models/university/university';
import { Mapper } from '../mappers/mapper';

const mapGetUniversitiesData: Mapper<University[]> = (
  data: any
): University[] => {
  // Assuming the API response data is an array of objects
  return data.map((universityData: any) => ({
    id: universityData._id,
    name: universityData.name,
    image: universityData.image,
    courses: universityData.courses,
    createdAt: new Date(universityData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
};
const mapGetUniversityData: Mapper<University> = (data: any): University => {
  return {
    id: data._id,
    name: data.name,
    image: data.image,
    courses: data.courses,
    createdAt: new Date(data.createdAt.seconds * 1000) // Convert seconds to milliseconds
  };
};

export { mapGetUniversitiesData, mapGetUniversityData };
