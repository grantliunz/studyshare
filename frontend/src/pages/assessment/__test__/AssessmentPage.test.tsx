import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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

const renderWithRouter = (element: ReactNode, url: string, path: string) => {
  return render(
    <MemoryRouter initialEntries={[url]}>
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
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('i')).toBeInTheDocument();
      expect(screen.getByText('ii')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
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
});
