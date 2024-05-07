// @ts-nocheck

import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { courseId, assessmentId } from '../testUtil/testIds';
import { Assessment } from '@shared/types/models/assessment/assessment';
import { AssessmentType } from '@shared/types/models/assessment/assessment';

const randomYear = Math.floor(Math.random() * 10000 + 2000);

it('createAssessment', async () => {
  const newAssessment: Assessment = {
   courseId: courseId,
   type: AssessmentType.Exam,
   year: randomYear,
   semester: "First",
   questions: [],
   latestContributor: null,
   newestQuestion: null
  };
 

 expect(await postResponse(`${API.postAssessment}/` + courseId, newAssessment)).toBe(201);
});

it('createAssessmentDuplicate', async () => {
 const newAssessment: Assessment = {
  courseId: courseId,
  type: AssessmentType.Exam,
  year: randomYear,
  semester: "First",
  questions: [],
  latestContributor: null,
  newestQuestion: null
 };
 expect(await postResponse(`${API.postAssessment}/` + courseId, newAssessment)).toBe(400);
});

it('createAssessmentMissingCourse', async () => {
 const newAssessment: Assessment = {
  courseId: courseId,
  type: AssessmentType.Exam,
  year: randomYear,
  semester: "First",
  questions: [],
  latestContributor: null,
  newestQuestion: null
 };


expect(await postResponse(`${API.postAssessment}/` + '0', newAssessment)).toBe(404);
});

it('getAllAssessments', async () => { 
 expect (await getResponse(`${API.getCourseAssessments}/`+ courseId)).toBe(200);
});

it('getAllAssessmentsMissingCourse', async () => { 
 expect (await getResponse(`${API.getCourseAssessments}/`+ '0')).toBe(404);
});

it('getOneAssessment', async () => { 
 expect (await getResponse(`${API.getAssessment}/`+ assessmentId)).toBe(200);
});

it('getOneAssessmentNonexistent', async () => { 
 expect (await getResponse(`${API.getAssessment}/`+ '0')).toBe(404);
});