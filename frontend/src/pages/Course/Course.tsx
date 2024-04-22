import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddCourseForm from './AddCourseForm';
import style from './Course.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface course {
  id: number;
  courseCode: string;
  courseName: string;
}

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
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleAddCourse = (courseName: string, courseCode: string) => {
    // Implement adding a new course to your data (e.g., API call)
    console.log('Adding course:', courseName, courseCode);
    // For demonstration purposes, let's just log the new name
    const newCourse: course = {
      id: courseData.length + 1,
      courseName,
      courseCode
    };
    const updatedCourses = [...courseData, newCourse];
    // Assuming courses is a state variable, update it
    // setCourses(updatedCourses);
    setShowForm(false); // Hide the form after adding
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className={style.container}>
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
      <AddCourseForm
        open={showForm}
        onAddCourse={handleAddCourse}
        onClose={handleCloseForm}
      />
    </div>
  );
}
