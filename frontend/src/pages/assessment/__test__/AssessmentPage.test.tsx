import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import API from '../../../util/api';
import AssessmentPage from '../AssessmentPage';
import {
  AssessmentGET,
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';
import { UserDisplayDTO } from '@shared/types/models/user/user';

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

describe('AssessmentPage', () => {
  const mockAssessment: AssessmentGET = {
    courseId: '111',
    _id: '123',
    type: AssessmentType.EXAM,
    year: 2023,
    semester: SemesterType.FIRST,
    questions: [
      {
        _id: '900',
        assessment: '123',
        number: ['1', 'a', 'i'],
        versions: [
          {
            text: 'What is the speed of light?',
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
            text: 'What is the speed of sound?',
            author: '200',
            createdAt: new Date()
          }
        ],
        answers: [],
        comments: [],
        latestContributor: '200'
      },
      {
        _id: '902',
        assessment: '123',
        number: ['2'],
        versions: [
          {
            text: 'What is the speed of Usain Bolt?',
            author: '200',
            createdAt: new Date()
          }
        ],
        answers: [],
        comments: [],
        latestContributor: '200'
      }
    ]
  };

  const mockAuthor: UserDisplayDTO = {
    name: 'John Doe'
  };

  // Mock Axios requests
  const axiosMock = new MockAdapter(axios);
  const assessmentUrl = new RegExp(
    `.*${API.getAssessment}/${mockAssessment._id}$`
  );
  const authorUrl = new RegExp(`.*${API.getUser}.*`);

  beforeEach(() => {
    // Mock GET request to fetch assessment data
    axiosMock.onGet(assessmentUrl).reply(200, mockAssessment);
    axiosMock.onGet(authorUrl).reply(200, mockAuthor);
    for (const question of mockAssessment.questions) {
      const url = new RegExp(`.*${API.getQuestion}/${question._id}`);
      axiosMock.onGet(url).reply(200, question);
    }
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('displays the questions', async () => {
    // Render the AssessmentPage component
    renderWithRouter(
      <AssessmentPage />,
      `/${mockAssessment._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question numbers should be displayed
      for (const question of mockAssessment.questions) {
        for (const num of question.number) {
          expect(screen.getByText(num)).toBeInTheDocument();
        }
      }
    });
  });

  it('displays first question by default', async () => {
    // Render the AssessmentPage component
    renderWithRouter(
      <AssessmentPage />,
      `/${mockAssessment._id}`,
      '/:assessmentId'
    );

    waitFor(() => {
      // question number should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].number.join(''))
      ).toBeInTheDocument();

      // latest version of question should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).toBeInTheDocument();

      // author of latest version should be displayed
      expect(screen.getByText(mockAuthor.name)).toBeInTheDocument();
    });
  });

  it('navigates by question tab', async () => {
    // Render the AssessmentPage component
    renderWithRouter(
      <AssessmentPage />,
      `/${mockAssessment._id}`,
      '/:assessmentId'
    );

    // ensure first question is displayed
    waitFor(() => {
      // question number should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].number.join(''))
      ).toBeInTheDocument();
      // latest version of question should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).toBeInTheDocument();
    });

    waitFor(async () => {
      // click on next question
      fireEvent.click(
        screen.getByText(mockAssessment.questions[1].number.at(-1)!)
      );
      expect(
        screen.getByText(mockAssessment.questions[1].number.join(''))
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockAssessment.questions[1].versions.at(-1)!.text)
      ).toBeInTheDocument();
      expect(
        screen.findByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).not.toBeInTheDocument();
    });
  });

  it('navigates by next question button', async () => {
    // Render the AssessmentPage component
    renderWithRouter(
      <AssessmentPage />,
      `/${mockAssessment._id}`,
      '/:assessmentId'
    );

    // ensure first question is displayed
    waitFor(() => {
      // question number should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].number.join(''))
      ).toBeInTheDocument();
      // latest version of question should be displayed
      expect(
        screen.getByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).toBeInTheDocument();
    });

    waitFor(async () => {
      // click on next question button
      expect(screen.getByTitle('Go to next question')).toBeInTheDocument();

      fireEvent.click(screen.getByTitle('Go to next question'));

      expect(
        screen.getByText(mockAssessment.questions[1].number.join(''))
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockAssessment.questions[1].versions.at(-1)!.text)
      ).toBeInTheDocument();
      expect(
        screen.findByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).not.toBeInTheDocument();
    });
  });

  it('can set initial question', async () => {
    // Render the AssessmentPage component
    const initialQuestion = mockAssessment.questions[2];

    renderWithRouter(
      <AssessmentPage />,
      `/${mockAssessment._id}`,
      '/:assessmentId',
      { quest: initialQuestion._id }
    );

    waitFor(() => {
      expect(
        screen.findByText(initialQuestion.versions.at(-1)!.text)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(mockAssessment.questions[0].versions.at(-1)!.text)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(mockAssessment.questions[1].versions.at(-1)!.text)
      ).not.toBeInTheDocument();
    });
  });
});
