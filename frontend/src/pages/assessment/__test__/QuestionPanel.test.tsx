import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import API from '../../../util/api';
import { UserDb } from '@shared/types/models/user/user';
import { Question, QuestionLazy } from '@shared/types/models/question/question';
import QuestionPanel from '../QuestionPanel';
import { Answer } from '@shared/types/models/answer/answer';

const renderWithRouter = (
  element: ReactNode,
  url: string,
  path: string,
  state: { quest: string } | undefined = undefined
) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: url, state }]}>
      <Routes>
        <Route path={path} element={element}></Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('QuestionPanel', () => {
  const mockAuthor: UserDb = {
    _id: '200',
    authId: '123',
    name: 'Jonn Doe',
    email: 'john@gmail.com',
    questions: [],
    watchList: [],
    answers: [],
    upvotedAnswers: [],
    downvotedComments: [],
    downvotedAnswers: [],
    upvotedComments: [],
    reported: [],
    createdAt: new Date()
  };

  const mockAnswers: Answer[] = [
    {
      _id: '300',
      text: 'I think it is 10m/s',
      rating: {
        upvotes: 10,
        downvotes: 2
      },
      author: '200',
      comments: [],
      createdAt: new Date()
    },
    {
      _id: '301',
      text: 'I think it is 20m/s',
      rating: {
        upvotes: 4,
        downvotes: 2
      },
      author: '201',
      comments: [],
      createdAt: new Date()
    }
  ];

  const mockQuestions: QuestionLazy[] = [
    {
      _id: '900',
      assessment: '123',
      number: ['1', 'a', 'i'],
      versions: [
        {
          text: '<p>What is the speed of light?</p>',
          author: '200',
          createdAt: new Date()
        }
      ],
      answers: [],
      comments: [],
      latestContributor: '200'
    },
    {
      _id: '901',
      assessment: '123',
      number: ['1', 'a', 'ii'],
      versions: [
        {
          text: '<p>What is the speed of sound?</p>',
          author: '200',
          createdAt: new Date()
        }
      ],
      answers: mockAnswers.map((answer) => answer._id),
      comments: [],
      latestContributor: '200'
    },
    {
      _id: '902',
      assessment: '123',
      number: ['2'],
      versions: [
        {
          text: '<p>What is the speed of Usain Bolt?</p>',
          author: '200',
          createdAt: new Date()
        }
      ],
      answers: [],
      comments: [],
      latestContributor: '200'
    }
  ];

  const mockQuestion: Question = {
    _id: '901',
    assessment: '123',
    number: ['1', 'a', 'ii'],
    versions: [
      {
        text: '<p>What is the speed of sound?</p>',
        author: mockAuthor,
        createdAt: new Date(),
        isAnonymous: false
      }
    ],
    answers: mockAnswers,
    comments: [],
    latestContributor: '200',
    isAnonymous: false,
    createdAt: new Date(),
    reporters: []
  };

  const mockQuestionAnonymous: Question = {
    ...mockQuestion,
    isAnonymous: true
  };

  const mockQuestionsAnonymous: QuestionLazy[] = mockQuestions.map(
    (question) => ({ ...question, isAnonymous: true })
  );

  // Mock Axios requests
  const axiosMock = new MockAdapter(axios);
  const questionUrl = new RegExp(`.*${API.getQuestion}/${mockQuestion._id}$`);

  beforeEach(() => {
    // Mock GET request to fetch assessment data
    axiosMock.onGet(questionUrl).reply(200, mockQuestion);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('displays the question number', async () => {
    // Render the QuestionPanel component
    renderWithRouter(
      <QuestionPanel
        setQuestion={() => {}}
        currentQuestion={mockQuestions[1]}
        question={mockQuestions[1]}
        prevQuestion={mockQuestions[0]}
        nextQuestion={mockQuestions[2]}
      />,
      `/${mockQuestion._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question number should be displayed
      expect(
        screen.getByText(mockQuestion.number.join(''))
      ).toBeInTheDocument();
    });
  });

  it('displays the question text', async () => {
    // Render the QuestionPanel component
    renderWithRouter(
      <QuestionPanel
        setQuestion={() => {}}
        currentQuestion={mockQuestions[1]}
        question={mockQuestions[1]}
        prevQuestion={mockQuestions[0]}
        nextQuestion={mockQuestions[2]}
      />,
      `/${mockQuestion._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question text should be displayed
      expect(
        screen.getByText(mockQuestion.versions.at(-1)!.text)
      ).toBeInTheDocument();
    });
  });

  it('displays the question author', async () => {
    // Render the QuestionPanel component
    renderWithRouter(
      <QuestionPanel
        setQuestion={() => {}}
        currentQuestion={mockQuestions[1]}
        question={mockQuestions[1]}
        prevQuestion={mockQuestions[0]}
        nextQuestion={mockQuestions[2]}
      />,
      `/${mockQuestion._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question text should be displayed
      expect(
        screen.getByText(mockQuestion.versions.at(-1)!.author.name)
      ).toBeInTheDocument();
    });
  });

  it('displays the answers', async () => {
    // Render the QuestionPanel component
    renderWithRouter(
      <QuestionPanel
        setQuestion={() => {}}
        currentQuestion={mockQuestions[1]}
        question={mockQuestions[1]}
        prevQuestion={mockQuestions[0]}
        nextQuestion={mockQuestions[2]}
      />,
      `/${mockQuestion._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question text should be displayed
      for (const answer of mockQuestion.answers) {
        expect(screen.getByText(answer.text)).toBeInTheDocument();
      }
    });
  });

  it('displays question anonymous author', async () => {
    axiosMock.onGet(questionUrl).reply(200, mockQuestionAnonymous);
    // Render the QuestionPanel component
    renderWithRouter(
      <QuestionPanel
        setQuestion={() => {}}
        currentQuestion={mockQuestionsAnonymous[1]}
        question={mockQuestionsAnonymous[1]}
        prevQuestion={mockQuestionsAnonymous[0]}
        nextQuestion={mockQuestionsAnonymous[2]}
      />,
      `/${mockQuestionAnonymous._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // Anonymous author should be displayed
      const createdBy = screen.getByText('Created by');
      console.log(createdBy);
      expect(createdBy).toBeInTheDocument();
      expect(within(createdBy).findByText('Anonymous')).toBeInTheDocument();
    });
  });
});
