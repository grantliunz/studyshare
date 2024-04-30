import { Button } from '@mui/material';
import styles from './AssessmentCard.module.css';
import { AssessmentType, SemesterType } from '../../types/assessment';
import { useNavigate } from 'react-router-dom';

type AssessmentCardProps = {
  assessment: {
    _id?: string;
    type: AssessmentType;
    number?: number;
    year: number;
    semester: SemesterType;
  };
};
// interface AssessmentCardProps {
//     AssessmentType: string;
//     Number: number;
//     Year: number;
//     Semester: string;
// }

export default function AssessmentCard({ assessment }: AssessmentCardProps) {
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

  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(`/assessment/${assessment._id}`)}
      variant="contained"
      sx={{
        borderRadius: '10px',
        boxShadow: 3
      }}
      style={{
        display: 'block',
        width: '200px',
        backgroundColor: '#D9D9D9',
        color: 'black',
        textTransform: 'none',
        margin: '10px'
      }}
    >
      <p className={styles.yearText}>{assessment.year}</p>
      <p className={styles.semesterText}>
        {' '}
        {mapSemesterToString(assessment.semester)}
      </p>
    </Button>
  );
}
