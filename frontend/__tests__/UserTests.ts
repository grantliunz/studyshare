// @ts-nocheck

import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { CreateAnswerDTO, MakeVoteDTO } from '@shared/types/models/answer/answer'
import { userId, answerId, questionId, universityId, courseId, assessmentId, commentId } from '../testUtil/testIds';
import { CreateAssessmentDTO } from '../../backend/src/routes/assessment/assessment-dto';
import { Assessment } from '@shared/types/models/assessment/assessment';
import { AssessmentType } from '@shared/types/models/assessment/assessment';

it('getUser', async () => { 
 expect (await getResponse(`${API.getUser}/`+ userId)).toBe(200);
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