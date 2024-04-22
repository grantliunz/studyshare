import { University } from '../types/types';
import { Mapper } from './mapper';

export default function mapUniversityData(data: any): Mapper<University[]> {
  return data.map((universityData: any) => ({
    id: universityData._id,
    name: universityData.Name,
    courses: universityData.Courses,
    createdAt: new Date(universityData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
}
