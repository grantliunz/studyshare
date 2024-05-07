// @ts-nocheck

import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { CreateAnswerDTO, MakeVoteDTO } from '@shared/types/models/answer/answer'
import { universityId, courseId } from '../testUtil/testIds';


const randomCourseNo = Math.floor(Math.random() * 1000);
const randomCourseNo2 = Math.floor(Math.random() * 1000);

it('createCourse', async () => {
 const newCourse = {
  code: "TEST" + randomCourseNo,
  name: "Test Course Name"
};
expect(await postResponse(`${API.postCourse}/` + universityId, newCourse)).toBe(201);
});

it('createDuplicateCourse', async () => {
 const newCourse = {
  code: "TEST" + randomCourseNo,
  name: "Test Course Name"
};
expect(await postResponse(`${API.postCourse}/` + universityId, newCourse)).toBe(400);
});

it('createCourseNonexistentUni', async () => {
 const newCourse = {
  code: "TEST" + randomCourseNo2,
  name: "Test Course Name"
};
expect(await postResponse(`${API.postCourse}/` + '0', newCourse)).toBe(404);
});

it('getAllCourses', async () => {
 expect(await getResponse(`${API.getCourses}/` + universityId)).toBe(200);
});

it('getAllCoursesNonexistent', async () => {
 expect(await getResponse(`${API.getCourses}/` + '0')).toBe(404);
});

it('getCourse', async () => {
 expect(await getResponse(`${API.getCourse}/` + courseId)).toBe(200);
});

it('getNonexistentCourse', async () => {
 expect(await getResponse(`${API.getCourse}/` + '0')).toBe(404);
});

