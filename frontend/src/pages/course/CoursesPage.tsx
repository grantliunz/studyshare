import CourseCard from './CourseCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddCourseForm from './AddCourseForm';
import style from './Course.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddButton from '../../components/AddButton/AddButton';
import { Course, University } from '../../types/types';
import useGet from '../../hooks/useGet';
import API from '../../util/api';
import { mapGetCoursesData } from '../../mappers/courseMapper';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  OutlinedInput
} from '@mui/material';
import { mapGetUniversityData } from '../../mappers/universityMapper';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';

export default function CoursesPage() {
  const [showForm, setShowForm] = useState(false);
  const { universityId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');
  const [yearLevels, setYearLevels] = useState<string[]>([]);

  const [displayedData, setDisplayedData] = useState<
    Course[] | null | undefined
  >(null);

  const {
    data: courseData,
    isLoading: isLoadingCourses,
    refresh: refreshCourses,
    error: errorString = null
  } = useGet<Course[]>(
    `${API.getCourses}/${universityId}`,
    [],
    mapGetCoursesData
  );

  const { data: universityData } = useGet<University>(
    `${API.getUniversityById}/${universityId}`,
    null,
    mapGetUniversityData
  );

  useEffect(() => {
    if (!query.trim() && yearLevels.length === 0) {
      setDisplayedData(courseData);
    } else {
      const filtered = courseData?.filter((course) => {
        const codeNumberMatch = course.code.match(/[^\d]*(\d|$)/);
        const yearLevel = codeNumberMatch ? codeNumberMatch[1] : null;
        const matchesQuery =
          course.name.toLowerCase().includes(query.toLowerCase()) ||
          course.code.toLowerCase().includes(query.toLowerCase());

        const meetsYearLevelCriteria =
          yearLevels.length === 0 ||
          (!yearLevel && yearLevels.includes('')) || // Include courses with no numbers in the code
          (yearLevel && yearLevels.includes(yearLevel));

        return matchesQuery && meetsYearLevelCriteria;
      });
      setDisplayedData(filtered);
    }
  }, [query, courseData, yearLevels]);

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
    <>
      <BreadCrumbs />
      <div className={style.container}>
        {universityData && (
          <h1 className={style.uniName}>{universityData.name}</h1>
        )}
        {errorString ? (
          <div>{errorString}</div>
        ) : (
          !isLoadingCourses && (
            <div className={style.searchAndFilter}>
              <SearchBar
                title="Search for a course"
                onQueryChange={onQueryChange}
              />
              <FormControl className={style.yearLevelSelect}>
                <InputLabel id="year-level-select-label">
                  Select Year
                </InputLabel>
                <Select
                  labelId="year-level-select-label"
                  id="year-level-select"
                  multiple
                  value={yearLevels.sort((a, b) => a.localeCompare(b))}
                  onChange={onYearLevelChange}
                  input={<OutlinedInput label="Select Year" />}
                  renderValue={(selected) =>
                    selected.map((value) => value + '00').join(', ')
                  }
                >
                  {[1, 2, 3, 4, 7].map((value) => (
                    <MenuItem key={value} value={value.toString()}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={yearLevels.includes(value.toString())}
                          />
                        }
                        label={value * 100}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )
        )}

        {isLoadingCourses && <CircularProgress />}
        {displayedData &&
          displayedData.map((course, index) => (
            <CourseCard
              key={index}
              courseCode={course.code}
              courseName={course.name}
              onClick={() => navigate(`/${universityId}/${course.id}`)}
            />
          ))}
        {displayedData?.length === 0 && !isLoadingCourses && !errorString && (
          <p>No courses found</p>
        )}
        <AddCourseForm
          open={showForm}
          onClose={handleCloseForm}
          universityId={universityId!}
          refreshCourses={refreshCourses}
        />
        <AddButton handleOpenForm={handleOpenForm} />
      </div>
    </>
  );
}
