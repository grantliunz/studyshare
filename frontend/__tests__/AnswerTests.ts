// @ts-nocheck

import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { CreateAnswerDTO, MakeVoteDTO } from '@shared/types/models/answer/answer'
import { userId, answerId, questionId } from '../testUtil/testIds';

it('getAnswer', async () => { 
 expect (await getResponse(`${API.getAnswer}/`+ answerId)).toBe(200);
});

it('getNonexistentAnswer', async () => { 
 expect (await getResponse(`${API.getAnswer}/`+'0')).toBe(404);
});

it('voteAnswer', async () => {
 const MakeVoteDto : MakeVoteDTO = {
  userId: userId,
  oldVoteDirection: 0,
  newVoteDirection: 1
 }

 expect (await postResponse(`${API.voteAnswer}/`+answerId, MakeVoteDto)).toBe(201);
});

it('voteAnswerNonExistent', async () => {
 const MakeVoteDto : MakeVoteDTO = {
  userId: userId,
  oldVoteDirection: 0,
  newVoteDirection: 1
 }

 expect (await postResponse(`${API.voteAnswer}/`+'0', MakeVoteDto)).toBe(404);
});


it('createAnswer', async () => {
 const answer : CreateAnswerDTO = {
  text: 'dummy answer',
  author: userId,
  rating: {
   upvotes: 0,
   downvotes: 0
  },
  comments: [],
  isAnonymous: false,
  question: questionId
 };

 expect(await postResponse(`${API.createAnswer}/` + questionId, answer)).toBe(201);
});

it('createAnswerNonexistentQ', async () => {
 const answer : CreateAnswerDTO = {
  text: 'dummy answer',
  author: userId,
  rating: {
   upvotes: 0,
   downvotes: 0
  },
  comments: [],
  isAnonymous: false,
  question: questionId
 };

 expect(await postResponse(`${API.createAnswer}/` + '0', answer)).toBe(404);
});

it('createAnswerAnonymous', async () => {
 const answer : CreateAnswerDTO = {
  text: 'dummy answer 2',
  author: userId,
  rating: {
   upvotes: 0,
   downvotes: 0
  },
  comments: [],
  isAnonymous: true,
  question: questionId
 };

 expect(await postResponse(`${API.createAnswer}/` + questionId, answer)).toBe(201);
});



