import { University } from '../types/types'; // Import the University interface from your types file

export default function mapUniversityData(data: any): University[] {
  return data.map((universityData: any) => ({
    id: universityData._id,
    name: universityData.Name,
    courses: universityData.Courses,
    createdAt: new Date(universityData.createdAt.seconds * 1000) // Convert seconds to milliseconds
  }));
}
