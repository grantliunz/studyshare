import { Button } from "@mui/material";
import styles from './AssessmentCard.module.css';


type AssessmentCardProps = {
    assessment: {
        AssessmentType: string;
        Number: number;
        Year: number;
        Semester: string;
    }
}
// interface AssessmentCardProps {
//     AssessmentType: string;
//     Number: number;
//     Year: number;
//     Semester: string;
// }

export default function AssessmentCard({assessment}: AssessmentCardProps) {
    console.log(assessment.AssessmentType)
    return (
        <Button variant="contained" sx={{
            borderRadius: '10px',
            boxShadow: 3
        }}
        style={{
            display: 'block',
            width: '200px',
            backgroundColor: '#D9D9D9',
            color: 'black',
            textTransform: 'none',
            margin: '10px',
            
        }}>
            <p className={styles.yearText}>{assessment.Year}</p>
            <p className={styles.semesterText}> {assessment.Semester + " Semester"}</p>
        </Button>
    );
};