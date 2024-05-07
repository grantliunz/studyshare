import {
  RenderOptions,
  fireEvent,
  render,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursesPage from '../CoursesPage';
import API from '../../../util/api';
import { MemoryRouter } from 'react-router-dom';
import { it, expect } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { University } from '@shared/types/models/university/university';
import { Course } from '@shared/types/models/course/course';

// Mock Axios requests
const mockUniversity: University = {
  id: '662f9cf0c02c023a03c89544',
  name: 'Monkey',
  image: '1',
  courses: ['1', '2'],
  createdAt: new Date()
};

const mockCourses: (Omit<Course, 'id'> & {
  _id: string;
})[] = [
  {
    _id: '1',
    name: 'Data Structures and Algorithms',
    code: 'SOFTENG284',
    assessments: [],
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Software Engineering Design',
    code: 'SOFTENG306',
    assessments: [],
    createdAt: new Date()
  }
];

const axiosMock = new MockAdapter(axios);
const getUniversityUrl = new RegExp(`.*${API.getUniversityById}.*`);
const getCoursesUrl = new RegExp(`.*${API.getCourses}.*`);

beforeEach(() => {
  // Mock GET request to fetch answer data
  axiosMock.onGet(getUniversityUrl).reply(200, mockUniversity);

  // MOCK GET request to fetch author data
  axiosMock.onGet(getCoursesUrl).reply(200, mockCourses);
});

afterEach(() => {
  axiosMock.reset();
});

describe('CoursesPage', () => {
  it('renders university name', async () => {
    render(
      <MemoryRouter initialEntries={['/test/123123']}>
        <CoursesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockUniversity.name)).toBeInTheDocument();
    });
  });

  it('renders courses correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/test/123123']}>
        <CoursesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      for (const course of mockCourses) {
        expect(screen.getByText(course.name)).toBeInTheDocument();
        expect(screen.getByText(course.code)).toBeInTheDocument();
      }
    });
  });

  it('filters courses based on search query', async () => {
    render(
      <MemoryRouter initialEntries={['/test/123123']}>
        <CoursesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for a course');

      expect(searchInput).toBeInTheDocument();

      userEvent.type(searchInput, '284');
      expect(screen.getByText(mockCourses[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockCourses[1].name)).not.toBeInTheDocument();
    });
  });
});
