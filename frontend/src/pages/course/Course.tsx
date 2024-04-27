import CourseCard from './CourseCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddCourseForm from './AddCourseForm';
import style from './Course.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddButton from '../../components/AddButton/AddButton';
import { Course, PostCourse } from '../../types/types';
import useGet from '../../hooks/useGet';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import {
  mapGetCoursesData,
  mapGetCourseData
} from '../../mappers/courseMapper';
import { CircularProgress } from '@mui/material';

// interface course {
//   id: number;
//   courseCode: string;
//   courseName: string;
// }

// const courseData = [
//   { courseCode: 'SOFTENG 284', courseName: 'Data Structures and Algorithms' },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   },
//   { courseCode: 'SOFTENG 206', courseName: 'Software Engineering' },
//   {
//     courseCode: 'SOFTENG 251',
//     courseName: 'Introduction to Software Engineering'
//   }
// ];

export default function CoursePage() {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');
  const [displayedData, setDisplayedData] = useState<
    Course[] | null | undefined
  >(null);

  const {
    data: courseData,
    isLoading: isLoadingCourses,
    refresh: refreshCourses
  } = useGet<Course[]>(`${API.getCourses}/${id}`, [], mapGetCoursesData);

  const {
    postData: addCourse,
    isLoading: isAddingCourse,
    error: addCourseError
  } = usePost<PostCourse, Course>(`${API.postCourse}/${id}`, mapGetCourseData);

  useEffect(() => {
    if (!query.trim()) {
      setDisplayedData(courseData);
    } else {
      const filtered = courseData?.filter(
        (course) =>
          course.Name.toLowerCase().includes(query.toLowerCase()) ||
          course.Code.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedData(filtered);
    }
  }, [query, courseData]);

  const handleAddCourse = async (courseName: string, courseCode: string) => {
    if (!courseName.trim() || !courseCode.trim()) {
      return;
    }

    const newCourseData: PostCourse = {
      Code: courseCode,
      Name: courseName
    };

    const addedCourse = await addCourse(newCourseData);
    if (addedCourse) {
      setShowForm(false);
      refreshCourses();
    }
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const onQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div className={style.container}>
      <SearchBar title="Search for a course" onQueryChange={onQueryChange} />
      <br />

      {isLoadingCourses && <CircularProgress />}
      {displayedData &&
        displayedData.map((course, index) => (
          <CourseCard
            key={index}
            courseCode={course.Code}
            courseName={course.Name}
            onClick={() => navigate(`/${id}/${course.id}`)}
          />
        ))}
      <AddCourseForm
        open={showForm}
        onAddCourse={handleAddCourse}
        onClose={handleCloseForm}
      />
      {isAddingCourse && <CircularProgress />}
      <AddButton handleOpenForm={handleOpenForm} />
    </div>
  );
}
