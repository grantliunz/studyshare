import { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import AssessmentCard from './AssessmentCard';
import AddAssessmentButton from './AddAssessmentButton';
import styles from './Assessments.module.css';
import AssessmentCardOther from './AssessmentCardOther';
import AddAssessmentForm, { FormInputs } from './AddAssessmentForm';
import { useParams } from 'react-router-dom';
import useGet from '../../hooks/useGet';
import { Assessment, AssessmentType } from '../../types/assessment';
import API from '../../util/api';
import { CircularProgress } from '@mui/material';
import { Course } from '../../types/types';
import usePost from '../../hooks/usePost';
import { useAuth } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';

function mapSemesterToString(semester: string) {
  switch (semester) {
    case 'First':
      return 'Semester 1';
    case 'Second':
      return 'Semester 2';
    case 'Third':
      return 'Semester 3';
    case 'Other':
      return 'Other Semester';
    default:
      return semester;
  }
}

function matchString(assessment: Assessment, searchText: string) {
  const str =
    assessment.year.toString() +
    ' ' +
    mapSemesterToString(assessment.semester) +
    ' ' +
    assessment.number?.toString() +
    ' ' +
    assessment.name;
  return str.toLowerCase().includes(searchText.toLowerCase());
}

const Assessments = () => {
  const { universityId, courseId } = useParams();
  const { user: currentUser } = useAuth();
  const { data: course, isLoading: isFetchingCourse } = useGet<Course>(
    `${API.getCourse}/${courseId}`
  );

  const {
    data: assessments,
    isLoading: isFetchingAssessments,
    refresh: refreshAssessments
  } = useGet<Assessment[]>(`${API.getCourseAssessments}/${courseId}`, []);

  const { postData: createAssessment } = usePost<Assessment, Assessment>(
    `${API.postAssessment}/${courseId}`
  );

  const [assessmentTypeState, setAssessmentTypeState] =
    useState<AssessmentType>(AssessmentType.EXAM);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();

  function searchAssessments(searchText: string) {
    setSearchText(searchText);
  }

  const handleOpenForm = (type: AssessmentType) => {
    if (!currentUser) {
      alert('You must be logged in to make an assessment!');
      return;
    }
    console.log(type);
    setShowForm(true);
    setAssessmentTypeState(type);
  };

  const handleAddAssessment = async (
    formInputs: FormInputs,
    type: AssessmentType
  ) => {
    if (!currentUser) {
      alert('You must be logged in to make an assessment!');
      return;
    }
    if (!courseId) {
      console.log('no course id');
      return;
    }
    const res = await createAssessment({
      courseId,
      type,
      questions: [],
      ...formInputs
    });
    refreshAssessments();
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleCardClicked = (assessmentId: string | undefined) => {
    navigate(`/${universityId}/${courseId}/${assessmentId}`);
  };

  if (isFetchingAssessments || isFetchingCourse) {
    return <CircularProgress />;
  }

  return (
    <>
      <BreadCrumbs />
      <div className={styles.container}>
        <h1>{course?.code}</h1>
        <h2>{course?.name}</h2>
        <div className={styles.searchWrapper}>
          <SearchBar
            title="Search for a past paper"
            onQueryChange={searchAssessments}
          />
        </div>

        <div className={styles.assessmentsWrapper}>
          <h2 className={styles.typeHeader}>Exams</h2>
          <div className={styles.assessmentType}>
            {assessments &&
              assessments
                .filter((assessment) => matchString(assessment, searchText))
                .map((assessment) =>
                  assessment.type === 'Exam' ? (
                    <AssessmentCard
                      key={assessment._id}
                      assessment={assessment}
                      onClick={() => handleCardClicked(assessment._id)}
                    />
                  ) : null
                )}
            <AddAssessmentButton
              handleOpenForm={() => handleOpenForm(AssessmentType.EXAM)}
            />
          </div>

          <h2 className={styles.typeHeader}>Tests</h2>
          <div className={styles.assessmentType}>
            {assessments &&
              assessments.map((assessment) =>
                assessment.type === 'Test' ? (
                  <AssessmentCard
                    key={assessment._id}
                    assessment={assessment}
                    onClick={() => handleCardClicked(assessment._id)}
                  />
                ) : null
              )}
            <AddAssessmentButton
              handleOpenForm={() => handleOpenForm(AssessmentType.TEST)}
            />
          </div>

          <h2 className={styles.typeHeader}>Other</h2>
          <div className={styles.assessmentType}>
            {assessments &&
              assessments.map((assessment) =>
                assessment.type === 'Other' ? (
                  <AssessmentCardOther
                    key={assessment._id}
                    assessment={assessment}
                  />
                ) : null
              )}

            <AddAssessmentForm
              state={assessmentTypeState}
              show={showForm}
              onAddAssessment={handleAddAssessment}
              onClose={handleCloseForm}
            />

            <AddAssessmentButton
              handleOpenForm={() => handleOpenForm(AssessmentType.OTHER)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Assessments;
