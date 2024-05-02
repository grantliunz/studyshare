import { Mapper } from '../mappers/mapper';
import { UserDb, UserDbLazy } from '@shared/types/models/user/user';

const mapGetUsersData: Mapper<UserDb[]> = (data: any): UserDb[] => {
  return data.map((userData: any) => ({
    _id: userData._id,
    authId: userData.authId,
    name: userData.name,
    email: userData.email,
    questions: userData.questions,
    answers: userData.answers,
    watchList: userData.watchList,
    upvotedAnswers: userData.upvotedAnswers,
    downvotedAnswers: userData.downvotedAnswers,
    upvotedComments: userData.upvotedComments,
    downvotedComments: userData.downvotedComments,
    createdAt: new Date(userData.createdAt)
  }));
};

const mapGetUserData: Mapper<UserDbLazy> = (data: any): UserDbLazy => {
  return {
    authId: data.authId,
    _id: data._id,
    name: data.name,
    email: data.email,
    questions: data.questions,
    answers: data.answers,
    watchList: data.watchList,
    upvotedAnswers: data.upvotedAnswers,
    downvotedAnswers: data.downvotedAnswers,
    upvotedComments: data.upvotedComments,
    downvotedComments: data.downvotedComments,
    createdAt: new Date(data.createdAt)
  };
};

export { mapGetUsersData, mapGetUserData };
