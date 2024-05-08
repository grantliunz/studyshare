import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursesPage from '../CoursesPage';
import API from '../../../util/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { it, expect } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { University } from '@shared/types/models/university/university';
import { Course } from '@shared/types/models/course/course';
import { ReactNode } from 'react';

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
const getUniversityUrl = new RegExp(
  `.*${API.getUniversityById}/${mockUniversity.id}`
);
const getCoursesUrl = new RegExp(`.*${API.getCourses}/${mockUniversity.id}`);

beforeEach(() => {
  // Mock GET request to fetch answer data
  axiosMock.onGet(getUniversityUrl).reply(200, mockUniversity);

  // MOCK GET request to fetch author data
  axiosMock.onGet(getCoursesUrl).reply(200, mockCourses);
});

afterEach(() => {
  axiosMock.reset();
});

const renderWithRouter = (element: ReactNode, url: string, path: string) => {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path={path} element={element}></Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('CoursesPage', () => {
  it('renders university name', async () => {
    renderWithRouter(
      <CoursesPage />,
      `/${mockUniversity.id}`,
      '/:universityId'
    );

    await waitFor(() => {
      expect(screen.getByText(mockUniversity.name)).toBeInTheDocument();
    });
  });

  it('renders courses correctly', async () => {
    renderWithRouter(
      <CoursesPage />,
      `/${mockUniversity.id}`,
      '/:universityId'
    );

    await waitFor(() => {
      for (const course of mockCourses) {
        expect(screen.getByText(course.name)).toBeInTheDocument();
        expect(screen.getByText(course.code)).toBeInTheDocument();
      }
    });
  });

  it('filters courses based on search query', async () => {
    renderWithRouter(
      <CoursesPage />,
      `/${mockUniversity.id}`,
      '/:universityId'
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for a course');

      expect(searchInput).toBeInTheDocument();

      userEvent.type(searchInput, '284');
      expect(screen.getByText(mockCourses[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockCourses[1].name)).not.toBeInTheDocument();
    });
  });

  it('filters courses based on year level', async () => {
    renderWithRouter(
      <CoursesPage />,
      `/${mockUniversity.id}`,
      '/:universityId'
    );

    const searchInput = await screen.findByPlaceholderText(
      'Search for a course'
    );
    expect(searchInput).toBeInTheDocument();

    const noChoice = screen.queryByText('200');
    expect(noChoice).not.toBeInTheDocument();

    const combo = screen.getByRole('combobox');
    expect(combo).toBeInTheDocument();
    userEvent.click(combo);

    const optionsPopupEl = await screen.findByRole('listbox');
    expect(optionsPopupEl).toBeInTheDocument();

    const choice200 = screen.getByText('200');
    expect(choice200).toBeInTheDocument();

    fireEvent.click(choice200);

    expect(screen.queryByText(mockCourses[0].code)).toBeInTheDocument();
    expect(screen.queryByText(mockCourses[1].code)).not.toBeInTheDocument();
  });

  it('no courses found', async () => {
    renderWithRouter(
      <CoursesPage />,
      `/${mockUniversity.id}`,
      '/:universityId'
    );

    const searchInput = await screen.findByPlaceholderText(
      'Search for a course'
    );
    expect(searchInput).toBeInTheDocument();

    const noChoice = screen.queryByText('200');
    expect(noChoice).not.toBeInTheDocument();

    const combo = screen.getByRole('combobox');
    expect(combo).toBeInTheDocument();
    userEvent.click(combo);

    const optionsPopupEl = await screen.findByRole('listbox');
    expect(optionsPopupEl).toBeInTheDocument();

    const choice200 = screen.getByText('700');
    expect(choice200).toBeInTheDocument();

    fireEvent.click(choice200);

    expect(screen.queryByText(mockCourses[0].code)).not.toBeInTheDocument();
    expect(screen.queryByText(mockCourses[1].code)).not.toBeInTheDocument();
    expect(screen.getByText(/No courses found/i)).toBeInTheDocument();
  });
});
