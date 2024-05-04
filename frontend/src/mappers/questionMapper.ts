import { Mapper } from './mapper';
import { Answer } from '@shared/types/models/answer/answer';
import { commentMapper } from './commentMapper';
import {
  Question,
  QuestionVersionEntry
} from '@shared/types/models/question/question';

const questionMapper: Mapper<Question> = (data: any): Question => {
  return {
    _id: data._id,
    assessment: data.assessment,
    number: data.number,
    versions: data.versions.map((version: QuestionVersionEntry) => ({
      ...version,
      createdAt: new Date(version.createdAt)
    })),
    watchers: data.watchers,
    answers: data.answers.map((answer: Answer) => ({
      ...answer,
      createdAt: new Date(answer.createdAt),
      comments: answer.comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt)
      }))
    })),
    comments: data.comments.map((comment: any) => commentMapper(comment)),
    isAnonymous: data.isAnonymous,
    latestContributor: data.latestContributor,
    createdAt: new Date(data.createdAt)
  };
};

export { questionMapper };
