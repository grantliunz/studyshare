import { Mapper } from '../mappers/mapper';
import { University } from '../types/types';
const mapUniversityData: Mapper<University[]> = (data: any): University[] => {
  // Assuming the API response data is an array of objects
  return data.map((universityData: any) => ({
    id: universityData._id,
    name: universityData.Name,
    image: universityData.image,
    courses: universityData.Courses,
    createdAt: new Date(universityData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
};

export default mapUniversityData;
