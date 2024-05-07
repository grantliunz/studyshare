// @ts-nocheck
import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { CreateQuestionDTO } from '@shared/types/models/question/question';
import { userId, answerId, questionId, assessmentId } from '../testUtil/testIds';

it('getQuestion', async () => {
 expect(await getResponse(`${API.getQuestion}/` + questionId)).toBe(200);
});

it('getNonexistentQuestion', async () => {
 expect(await getResponse(`${API.getQuestion}/` + '0')).toBe(404);
});

it('createQuestion', async () => {
 const question : CreateQuestionDTO = {
  number: ['1', 'a'],
  versions: [],
  answers: [],
  reporters: [],
  comments: [],
  latestContributor: userId
 }

 expect(await postResponse(`${API.createQuestion}/` + assessmentId, question)).toBe(201);
});
