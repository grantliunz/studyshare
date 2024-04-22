import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import AssessmentCard from "./AssessmentCard";
import AddAssessmentButton from "./AddAssessmentButton";
import styles from './Assessments.module.css';

interface AssessmentsPageProps {
    Name: string;
    Code?: string;
    // Assessments?: AssessmentDisplayDTO[];
    Assessments: any[]; // replace when backend is ready

}

export default function Assessments(props?: AssessmentsPageProps) {

    // remove this section when backend is ready
    if (props?.Assessments === undefined){
        // default course
        props = {
            Name: "Default Course Name",
            Code: "ABC 123",
            Assessments: [
                {
                    AssessmentType: "Exam",
                    Number: 1,
                    Year: 2019,
                    Semester: "First"
                }, 
                {
                    AssessmentType: "Exam",
                    Number: 2,
                    Year: 2019,
                    Semester: "Second"
                }, 
                {
                    AssessmentType: "Test",
                    Number: 3,
                    Year: 2020,
                    Semester: "Second"
                }
                , 
                {
                    AssessmentType: "Other",
                    Number: 3,
                    Year: 2020,
                    Semester: "Second"
                }, 
                {
                    AssessmentType: "Exam",
                    Number: 2,
                    Year: 2018,
                    Semester: "Second"
                }, 
                {
                    AssessmentType: "Exam",
                    Number: 2,
                    Year: 2022,
                    Semester: "Second"
                }, 
                {
                    AssessmentType: "Exam",
                    Number: 2,
                    Year: 2023,
                    Semester: "Second"
                }
            ]
        };

    }

    const [matchingAssessments, setMatchingAssessments] = useState(props.Assessments);

    function searchAssessments(searchText: string){
        console.log(searchText)
        setMatchingAssessments(props.Assessments.filter((assessment) => {
            return assessment.Number.toString().includes(searchText) || 
            assessment.Year.toString().includes(searchText) || 
            assessment.Semester.includes(searchText);
        })); // should probably update this to match the displayed text later, will do when the enums and stuff are available to frontend
    }

    return (
        <div>
            <h1>{props.Name}</h1>
            <SearchBar title="Search for a past paper" onQueryChange={searchAssessments}/>
            
            <div>
                <h2 className={styles.typeHeader}>Exams</h2>
                <div className={styles.assessmentType}>
                    
                    {matchingAssessments.map((assessment) => 
                        ( assessment.AssessmentType === "Exam" 
                        ? <AssessmentCard assessment={assessment}/>
                        : null
                    ))}
                    <AddAssessmentButton />
                </div>

                <h2 className={styles.typeHeader}>Tests</h2>
                <div className={styles.assessmentType}>
                    
                    {matchingAssessments.map((assessment) => 
                        ( assessment.AssessmentType === "Test" 
                        ? <AssessmentCard assessment={assessment}/>
                        : null
                    ))}
                    <AddAssessmentButton />
                </div>

                <h2 className={styles.typeHeader}>Other</h2>
                <div className={styles.assessmentType}>
                    
                    {matchingAssessments.map((assessment) => 
                        ( assessment.AssessmentType === "Other" 
                        ? <AssessmentCard assessment={assessment}/>
                        : null
                    ))}
                    <AddAssessmentButton />
                </div>
            </div>
        </div>
    );
};