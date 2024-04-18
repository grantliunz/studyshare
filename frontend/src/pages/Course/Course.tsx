import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';

export default function CoursePage() {
  return (
    <div>
      <h1>Course Page</h1>

      <SearchBar title="Search for a course" />

      <CourseCard />
    </div>
  );
}
