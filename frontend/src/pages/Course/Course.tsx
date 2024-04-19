import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';

const courseData = [
  { courseCode: 'SOFTENG 284', courseName: 'Data Structures and Algorithms' },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  },
  { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
  {
    courseCode: 'SOFTENG 251',
    courseName: 'Introduction to Software Engineering'
  }
];

export default function CoursePage() {
  return (
    <div>
      <h1>Course Page</h1>

      <SearchBar title="Search for a course" />
      <br />

      {courseData.map((course, index) => (
        <CourseCard
          key={index}
          courseCode={course.courseCode}
          courseName={course.courseName}
          onClick={() => console.log('clicked')}
        />
      ))}
    </div>
  );
}
