import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../util/api';
import { Course, University } from '../../types/types';
import { AssessmentGET } from '../../types/assessment';
import { mapGetUniversityData } from '../../mappers/universityMapper';
import { mapGetCourseData } from '../../mappers/courseMapper';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const BreadCrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

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
    if (pathnames.length >= 1) {
      const universityId = pathnames[0];
      fetchUniversity(universityId);
    }
  }, []);
  if (pathnames.length >= 2) {
    const courseId = pathnames[1];
    fetchCourse(courseId);
  }
  if (pathnames.length >= 3) {
    const assessmentId = pathnames[2];
    fetchAssignment(assessmentId);
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {university && (
        <Link color="inherit" href={`/${university.id}`}>
          {university.name}
        </Link>
      )}
      {course && (
        <Link color="inherit" href={`/${university?.id}/${course.id}`}>
          {course.code}
        </Link>
      )}
      {assessment && (
        <Typography color="textPrimary">
          {assessment.year} {assessment.type}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
