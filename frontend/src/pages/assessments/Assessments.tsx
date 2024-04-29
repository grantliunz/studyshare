import { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import AssessmentCard from './AssessmentCard';
import AddAssessmentButton from './AddAssessmentButton';
import styles from './Assessments.module.css';
import AssessmentCardOther from './AssessmentCardOther';
import AddUniversityForm from '../university/AddUniversityForm';
import AddAssessmentForm, { FormInputs } from './AddAssessmentForm';
import { useParams } from 'react-router-dom';
import useGet from '../../hooks/useGet';
import { Assessment, AssessmentType } from '../../types/assessment';
import API from '../../util/api';

interface AssessmentsPageProps {
  Name: string;
  Code?: string;
  // Assessments?: AssessmentDisplayDTO[];
  Assessments: any[]; // replace when backend is ready
}

export default function Assessments() {
  // change to just an id and fetch the data from the backend
  // remove this section when backend is ready
  //   if (props?.Assessments === undefined) {
  //     // default course
  //     props = {
  //       Name: 'Default Course Name',
  //       Code: 'ABC 123',
  //       Assessments: [
  //         {
  //           AssessmentType: 'Exam',
  //           Number: 1,
  //           Year: 2019,
  //           Semester: 'First'
  //         },
  //         {
  //           AssessmentType: 'Exam',
  //           Number: 2,
  //           Year: 2019,
  //           Semester: 'Second'
  //         },
  //         {
  //           AssessmentType: 'Test',
  //           Number: 3,
  //           Year: 2020,
  //           Semester: 'Second'
  //         },
  //         {
  //           AssessmentType: 'Other',
  //           Number: 3,
  //           Year: 2020,
  //           Semester: 'Second',
  //           Name: 'Practise Exam 1'
  //         },
  //         {
  //           AssessmentType: 'Exam',
  //           Number: 2,
  //           Year: 2018,
  //           Semester: 'Second'
  //         },
  //         {
  //           AssessmentType: 'Exam',
  //           Number: 2,
  //           Year: 2022,
  //           Semester: 'Second'
  //         },
  //         {
  //           AssessmentType: 'Exam',
  //           Number: 2,
  //           Year: 2023,
  //           Semester: 'Second'
  //         }
  //       ]
  //     };
  //   }

  const { courseId } = useParams();
  console.log(courseId);

  const {
    data: polledAssessemets,
    isLoading: isFetchingAssessments,
    error: getAssessmentsError
  } = useGet<Assessment[]>(`${API.getCourseAssessments}/${courseId}`);

  const [assessmentTypeState, setAssessmentTypeState] =
    useState<AssessmentType>(AssessmentType.ASSIGNMENT);
  const [showForm, setShowForm] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (polledAssessemets) {
      setAssessments(polledAssessemets);
    }
  }, [polledAssessemets]);

  function matchString(assessment: any, searchText: string) {
    const str =
      assessment.Year.toString() +
      ' ' +
      mapSemesterToString(assessment.Semester) +
      ' ' +
      assessment.Number.toString() +
      ' ' +
      assessment.Name;
    return str.toLowerCase().includes(searchText.toLowerCase());
  }

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

  function searchAssessments(searchText: string) {
    setAssessments(
      assessments.filter((assessment) => {
        return matchString(assessment, searchText);
      })
    ); // should probably update this to match the displayed text later, will do when the enums and stuff are available to frontend
  }

  const handleOpenForm = (type: AssessmentType) => {
    console.log(type);
    setShowForm(true);
    setAssessmentTypeState(type);
  };

  const handleAddAssessment = async (
    formInputs: FormInputs,
    type: AssessmentType
  ) => {
    // any[] is used for now, i guess you could use a DTO later
    return; // TODO: implement this
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div style={{ paddingLeft: '7%', paddingRight: '7%' }}>
      <h1>PLACEHOLDER TEXT</h1>
      <SearchBar
        title="Search for a past paper"
        onQueryChange={searchAssessments}
      />

      <div>
        <h2 className={styles.typeHeader}>Exams</h2>
        <div className={styles.assessmentType}>
          {assessments.map((assessment) =>
            assessment.type === 'Exam' ? (
              <AssessmentCard assessment={assessment} />
            ) : null
          )}
          <AddAssessmentButton
            handleOpenForm={() => handleOpenForm(AssessmentType.EXAM)}
          />
        </div>

        <h2 className={styles.typeHeader}>Tests</h2>
        <div className={styles.assessmentType}>
          {assessments.map((assessment) =>
            assessment.type === 'Test' ? (
              <AssessmentCard assessment={assessment} />
            ) : null
          )}
          <AddAssessmentButton
            handleOpenForm={() => handleOpenForm(AssessmentType.TEST)}
          />
        </div>

        <h2 className={styles.typeHeader}>Other</h2>
        <div className={styles.assessmentType}>
          {assessments.map((assessment) =>
            assessment.type === 'Other' ? (
              <AssessmentCardOther assessment={assessment} />
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
  );
}
