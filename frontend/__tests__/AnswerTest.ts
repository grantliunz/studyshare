import API from '../src/util/api'
import { getResponse, postResponse } from '../testUtil/testUtil';
import { MakeVoteDTO } from '@shared/types/models/answer/answer'

const userId = '663902f4e9b47ba36a837b9d'

it('getNonexistentAnswer', async () => { 
 expect (await getResponse(`${API.getAnswer}/`+'0')).toBe(404);
});

it('getAnswerExists', async () => { 
 expect (await getResponse(`${API.getAnswer}/`+'66390c84477104edab32e406')).toBe(200);
});

it('voteAnswer', async () => {
 var MakeVoteDto : MakeVoteDTO = {
  userId: userId,
  oldVoteDirection: 0,
  newVoteDirection: 1
 }

 expect (await postResponse(`${API.voteAnswer}/`+'66390c84477104edab32e406', MakeVoteDto)).toBe(201);
});


