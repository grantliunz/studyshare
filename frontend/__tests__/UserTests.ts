// @ts-nocheck

import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { userId } from '../testUtil/testIds';
import { CreateUserDTO } from '../../backend/src/routes/user/user-dto'

const randomUserNo = Math.floor(Math.random() * 1000);

it('getUser', async () => { 
 expect (await getResponse(`${API.getUser}/`+ userId)).toBe(200);
});

it('createUser' , async () => {

 const user: CreateUserDTO = {
  authId: randomUserNo,
  name: 'your_name',
  email: 'your_email' + randomUserNo + '@gmail.com',
  questions: [],
  answers: [],
  watchList: [],
  reported: [],
  upvotedAnswers: [],
  downvotedAnswers: [],
  upvotedComments: [],
  downvotedComments: []
 };
 expect (await postResponse(`${API.createUser}`, user)).toBe(201);
 });

it('getNonexistentUser', async () => { 
 expect (await getResponse(`${API.getUser}/`+ '0')).toBe(404);
});

it('getAllUsers', async () => { 
 expect (await getResponse(`${API.getAllUsers}`)).toBe(200);
});

it('getNotifications', async () => { 
 expect (await getResponse(`${API.getNotifications}/`+ userId)).toBe(200);
});

it('getNotificationsNonexistentUser', async () => { 
 expect (await getResponse(`${API.getNotifications}/`+ '0')).toBe(404);
});