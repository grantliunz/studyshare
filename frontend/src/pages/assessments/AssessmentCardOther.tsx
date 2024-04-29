import { Button } from '@mui/material';
import styles from './AssessmentCard.module.css';
import { AssessmentType, SemesterType } from '../../types/assessment';

type AssessmentCardOtherProps = {
  assessment: {
    type: AssessmentType;
    number?: number;
    year: number;
    semester: SemesterType;
    name?: string;
  };
};

export default function AssessmentCardOther({
  assessment
}: AssessmentCardOtherProps) {
  return (
    <Button
      variant="contained"
      sx={{
        borderRadius: '10px',
        boxShadow: 3
      }}
      style={{
        display: 'block',
        width: '300px',
        backgroundColor: '#D9D9D9',
        color: 'black',
        textTransform: 'none',
        margin: '10px'
      }}
    >
      <p className={styles.yearText}>{assessment.name}</p>
      <p className={styles.otherYearText}> {assessment.year}</p>
    </Button>
  );
}
