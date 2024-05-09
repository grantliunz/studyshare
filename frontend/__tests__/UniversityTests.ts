// @ts-nocheck
import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { universityId, courseId} from '../testUtil/testIds';

const randomUniNo = Math.floor(Math.random() * 1000);


it('getAllUniversities', async () => {
 expect(await getResponse(`${API.getUniversities}`)).toBe(200);
});

it('getOneUniversity', async () => {
 expect(await getResponse(`${API.getUniversityById}/` + universityId)).toBe(200);
});

it('getOneUniversityNonExistent', async () => {
 expect(await getResponse(`${API.getUniversityById}/` + '0')).toBe(404);
});

it('createCourse', async () => {
 const newUni = {
  name: "Test University Name" + randomUniNo,
  courses: []
};

expect(await postResponse(`${API.postUniversity}`, newUni)).toBe(201);
});

it('createDuplicateCourse', async () => {
 const newUni = {
  name: "Test University Name" + randomUniNo,
  courses: []
};

expect(await postResponse(`${API.postUniversity}`, newUni)).toBe(400);
});

