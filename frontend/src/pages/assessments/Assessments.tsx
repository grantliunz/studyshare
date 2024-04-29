import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import AssessmentCard from "./AssessmentCard";
import AddAssessmentButton from "./AddAssessmentButton";
import styles from './Assessments.module.css';
import AssessmentCardOther from "./AssessmentCardOther";
import AddUniversityForm from "../university/AddUniversityForm";
import AddAssessmentForm from "./AddAssessmentForm";

interface AssessmentsPageProps {
    Name: string;
    Code?: string;
    // Assessments?: AssessmentDisplayDTO[];
    Assessments: any[]; // replace when backend is ready
}

export enum AssessmentType {
    NotActive = "NotActive",
    Exam = "Exam",
    Test = "Test",
    Other = "Other"
}

export default function Assessments(props?: AssessmentsPageProps) { // change to just an id and fetch the data from the backend
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
                    Semester: "Second",
                    Name: "Practise Exam 1"
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
    const [showForm, setShowForm] = useState(AssessmentType.NotActive);

    function searchAssessments(searchText: string){
        setMatchingAssessments(props.Assessments.filter((assessment) => {
            return assessment.Number.toString().includes(searchText) || 
            assessment.Year.toString().includes(searchText) || 
            assessment.Semester.includes(searchText);
        })); // should probably update this to match the displayed text later, will do when the enums and stuff are available to frontend
    }

    const handleOpenForm = (type : AssessmentType) => {
        console.log(type);
        setShowForm(type);
    }

    const handleAddAssessment = async (formInputs : any[], assessmentType : AssessmentType) => { // any[] is used for now, i guess you could use a DTO later
        return; // TODO: implement this 
    }

    const handleCloseForm = () => {
        setShowForm(AssessmentType.NotActive);
    }

    return (
        <div style={{ paddingLeft: '7%', paddingRight: '7%' }}>
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
                    <AddAssessmentButton handleOpenForm={() => handleOpenForm(AssessmentType.Exam)}/>
                </div>

                <h2 className={styles.typeHeader}>Tests</h2>
                <div className={styles.assessmentType}>
                    
                    {matchingAssessments.map((assessment) => 
                        ( assessment.AssessmentType === "Test" 
                        ? <AssessmentCard assessment={assessment}/>
                        : null
                    ))}
                    <AddAssessmentButton handleOpenForm={() => handleOpenForm(AssessmentType.Test)}/>
                </div>

                <h2 className={styles.typeHeader}>Other</h2>
                <div className={styles.assessmentType}>
                    
                    {matchingAssessments.map((assessment) => 
                        ( assessment.AssessmentType === "Other" 
                        ? <AssessmentCardOther assessment={assessment}/>
                        : null
                    ))}
                    
                    <AddAssessmentForm
                        state={showForm}
                        onAddAssessment={handleAddAssessment}
                        onClose={handleCloseForm}
                    />

                    <AddAssessmentButton handleOpenForm={() => handleOpenForm(AssessmentType.Other)}/>
                </div>
            </div>
        </div>
    );
};