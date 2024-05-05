import { Button } from '@mui/material';
import styles from './AssessmentCard.module.css';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';

type AssessmentCardOtherProps = {
  assessment: {
    _id?: string;
    type: AssessmentType;
    number?: number;
    year: number;
    semester: SemesterType;
    name?: string;
  };
  onClick: () => void;
};

export default function AssessmentCardOther({
  assessment,
  onClick
}: AssessmentCardOtherProps) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        borderRadius: '10px',
        backgroundColor: '#D9D9D9',
        '&:hover': {
          backgroundColor: '#BFBFBF' // Change the background color on hover
        }
      }}
      style={{
        display: 'block',
        width: '300px',
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
