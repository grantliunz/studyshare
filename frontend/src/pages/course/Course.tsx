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
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';

export default function CoursePage() {
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');
  const [yearLevels, setYearLevels] = useState<string[]>([]);

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
    console.log(yearLevels);
    if (!query.trim() && yearLevels.length === 0) {
      setDisplayedData(courseData);
    } else {
      const filtered = courseData?.filter((course) => {
        const codeNumber = course.Code.match(/\d+/)?.[0];
        const yearLevel = codeNumber?.charAt(0);
        if (!yearLevel) return false;
        const matchesQuery =
          course.Name.toLowerCase().includes(query.toLowerCase()) ||
          course.Code.toLowerCase().includes(query.toLowerCase());

        const meetsYearLevelCriteria =
          yearLevels.length === 0 ||
          (yearLevel && yearLevels.includes(yearLevel));

        return matchesQuery && meetsYearLevelCriteria;
      });
      setDisplayedData(filtered);
    }
  }, [query, courseData, yearLevels]);

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

  const onYearLevelChange = (event: SelectChangeEvent<string[]>) => {
    setYearLevels(event.target.value as string[]);
  };

  return (
    <div className={style.container}>
      <div className={style.searchAndFilter}>
        <SearchBar title="Search for a course" onQueryChange={onQueryChange} />
        <FormControl className={style.yearLevelSelect}>
          <InputLabel id="year-level-select-label">
            Filter by Year Level
          </InputLabel>
          <Select
            labelId="year-level-select-label"
            id="year-level-select"
            multiple
            value={yearLevels}
            onChange={onYearLevelChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            <MenuItem value="1">
              <FormControlLabel
                control={<Checkbox checked={yearLevels.includes('1')} />}
                label="100"
              />
            </MenuItem>
            <MenuItem value="2">
              <FormControlLabel
                control={<Checkbox checked={yearLevels.includes('2')} />}
                label="200"
              />
            </MenuItem>
            <MenuItem value="3">
              <FormControlLabel
                control={<Checkbox checked={yearLevels.includes('3')} />}
                label="300"
              />
            </MenuItem>
            <MenuItem value="4">
              <FormControlLabel
                control={<Checkbox checked={yearLevels.includes('4')} />}
                label="400"
              />
            </MenuItem>
            <MenuItem value="7">
              <FormControlLabel
                control={<Checkbox checked={yearLevels.includes('7')} />}
                label="700"
              />
            </MenuItem>
          </Select>
        </FormControl>
      </div>

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
