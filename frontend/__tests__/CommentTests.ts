// @ts-nocheck
import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { CreateCommentDTO, MakeVoteDTO } from '@shared/types/models/answer/answer'
import { userId, answerId, questionId, universityId, courseId, assessmentId, commentId } from '../testUtil/testIds';

it('getComment', async () => {
 expect (await getResponse(`${API.getComment}/`+ commentId)).toBe(200);
});

it('getComment', async () => {
 expect (await getResponse(`${API.getComment}/`+ '0')).toBe(404);
});

it('voteComment', async () => {
 const MakeVoteDto : MakeVoteDTO = {
  userId: userId,
  oldVoteDirection: 0,
  newVoteDirection: 1
 }

 expect (await postResponse(`${API.voteComment}/`+ commentId, MakeVoteDto)).toBe(201);
});

it('voteCommentNotExist', async () => {
 const MakeVoteDto : MakeVoteDTO = {
  userId: userId,
  oldVoteDirection: 0,
  newVoteDirection: 1
 }

 expect (await postResponse(`${API.voteComment}/`+ '0', MakeVoteDto)).toBe(404);
});

it('createComment', async () => {
 const createCommentDto: CreateCommentDTO = {
  userId: userId,
  answerId: answerId,
  content: 'This is a dummy comment'
 };

 expect(await postResponse(`${API.createComment}/`+ answerId, createCommentDto)).toBe(201);
});

it('createCommentNonExistent', async () => {
 const createCommentDto: CreateCommentDTO = {
  userId: userId,
  answerId: answerId,
  content: 'This is a dummy comment'
 };

 expect(await postResponse(`${API.createComment}/`+ '0', createCommentDto)).toBe(404);
});


