import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../util/api';
import { mapGetUniversityData } from '../../mappers/universityMapper';
import { mapGetCourseData } from '../../mappers/courseMapper';
import axios from 'axios';
import style from './BreadCrumbs.module.css';
import { University } from '@shared/types/models/university/university';
import { AssessmentGET } from '@shared/types/models/assessment/assessment';
import { Course } from '@shared/types/models/course/course';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const BreadCrumbs = () => {
  const { pathname } = useLocation();

  const [profile, setIsProfile] = useState<boolean>(false);
  const [course, setCourse] = useState<null | Course>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [assessment, setAssessment] = useState<AssessmentGET | null>(null);

  const fetchUniversity = async (universityId: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}${API.getUniversityById}/${universityId}`
      );
      if (response) {
        const data = await response.data;
        const object = mapGetUniversityData(data);
        setUniversity(object);
      } else {
        throw new Error('Failed to fetch university');
      }
    } catch (error) {
      console.error('Error fetching university:', error);
    }
  };

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}${API.getCourse}/${courseId}`
      );
      if (response) {
        const data = await response.data;
        const object = mapGetCourseData(data);
        setCourse(object);
      } else {
        throw new Error('Failed to fetch course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchAssignment = async (assessmentId: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}${API.getAssessment}/${assessmentId}`
      );
      if (response) {
        const data = await response.data;
        const object = data as AssessmentGET;
        setAssessment(object);
      } else {
        throw new Error('Failed to fetch assessment');
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
    }
  };

  useEffect(() => {
    const pathnames = pathname.split('/').filter((x) => x);

    if (pathnames.length === 1 && pathnames[0] === 'profile') {
      setIsProfile(true);
      return;
    }
    setIsProfile(false);
    if (pathnames.length >= 1) {
      const universityId = pathnames[0];
      if (universityId !== 'universities') {
        fetchUniversity(universityId);
      } else {
        setUniversity(null);
        return;
      }
    }
    if (pathnames.length >= 2) {
      const courseId = pathnames[1];
      fetchCourse(courseId);
    } else {
      setCourse(null);
      setAssessment(null);
    }
    if (pathnames.length >= 3) {
      const assessmentId = pathnames[2];
      fetchAssignment(assessmentId);
    } else {
      setAssessment(null);
    }
  }, [pathname]);

  function createAssessmentString(assessment: AssessmentGET): React.ReactNode {
    const typeMap: { [key: string]: string } = {
      Exam: 'Exam',
      Test: 'Test',
      Lab: 'Lab',
      Assignment: 'Assignment',
      Other: 'Other'
    };

    const semesterText = assessment.semester;
    const typeText = typeMap[assessment.type];

    let assessmentText = '';
    if (typeText !== 'Other') {
      assessmentText = ` ${typeText}`;
    } else {
      assessmentText = ` ${assessment.name}`;
    }

    if (assessment.type === 'Test') {
      assessmentText += ` ${assessment.number}`;
    }

    return `${assessment.year} ${semesterText}${assessmentText}`;
  }

  return (
    <div className={style.breadCrumbs}>
      <Breadcrumbs className={style.slashes}>
        {profile ? (
          <Typography className={`${style.link} ${style.assessment}`}>
            Profile
          </Typography>
        ) : (
          <Link className={style.link} href="/universities">
            Universities
          </Link>
        )}
        {university && !profile && (
          <Link className={style.link} href={`/${university.id}`}>
            {university.name}
          </Link>
        )}
        {course && !profile && (
          <Link className={style.link} href={`/${university?.id}/${course.id}`}>
            {course.code}
          </Link>
        )}
        {assessment && !profile && (
          <Typography className={`${style.link} ${style.assessment}`}>
            {createAssessmentString(assessment)}
          </Typography>
        )}
      </Breadcrumbs>
    </div>
  );
};

export default BreadCrumbs;
