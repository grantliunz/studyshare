import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import API from '../../../util/api';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Profile from '../Profile';

const mockUserDb = {
  _id: '1',
  name: 'John Doe',
  email: 'john@gmail.com',
  questions: ['2'],
  answers: ['3'],
  watchList: [
    {
      watchedId: '2',
      lastViewed: '2024-05-07T22:44:53.350Z',
      watchType: 'ASSESSMENT',
      _id: '2'
    },
    {
      watchedId: '1',
      lastViewed: '2024-05-08T06:29:37.757Z',
      watchType: 'QUESTION',
      _id: '1'
    }
  ]
};

const mockProfileData = {
  watchListedQuestions: [
    {
      id: '1',
      Title: '1.a.i',
      Description: 'Question title 1',
      Year: 'Semester 1 Exam 2024',
      DateCreated: '1 Jan 2024',
      Path: '/universityID/courseID/questionID'
    }
  ],
  addedQuestions: [
    {
      id: '2',
      Title: '1.a.ii',
      Description: 'Question title 2',
      Year: 'Semester 1 Exam 2024',
      DateCreated: '1 Jan 2024',
      Path: '/universityID/courseID/questionID'
    }
  ],
  answeredQuestions: [
    {
      id: '3',
      Title: 'Question title 3',
      Description: 'Answer 1',
      Year: 'Semester 1 Exam 2024',
      DateCreated: '1 Jan 2024',
      Path: '/universityID/courseID/questionID'
    }
  ],
  watchListedAssessments: [
    {
      id: '4',
      Title: 'Semester 1 Exam 2024',
      Description: '1 Jan 2024',
      Year: '',
      DateCreated: '',
      Path: '/universityID/courseID/questionID'
    }
  ]
};

const axiosMock = new MockAdapter(axios);
const profileData = new RegExp(`.*${API.getProfile}/${mockUserDb._id}$`);

beforeEach(() => {
  axiosMock.onGet(profileData).reply(200, mockProfileData);
});
afterEach(() => {
  axiosMock.reset();
});

vi.mock('../../../contexts/UserContext', () => ({
  useAuth: () => ({
    userDb: mockUserDb,
    logout: vi.fn()
  })
}));

describe('Profile', () => {
  it('renders user profile data correctly', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assessment Watchlist')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Question Watchlist')).toBeInTheDocument();
      expect(screen.getByText('Answers')).toBeInTheDocument();
    });
  });

  it('displays correct data when tags are clicked', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    await waitFor(() => {
      fireEvent.click(
        screen.getByRole('button', {
          name: /Question Watchlist/i
        })
      );
      expect(screen.getByText('1.a.i')).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', {
          name: /Questions Added/i
        })
      );
      expect(screen.getByText('1.a.ii')).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', {
          name: /Answers/i
        })
      );
      expect(screen.getByText('Question title 3')).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', {
          name: /Assessment Watchlist/i
        })
      );
      expect(screen.getByText('Semester 1 Exam 2024')).toBeInTheDocument();
    });
  });
});
