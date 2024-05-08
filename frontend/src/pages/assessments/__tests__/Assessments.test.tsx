import {
  RenderOptions,
  fireEvent,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import API from '../../../util/api';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/UserContext';
import Assessments from '../Assessments';

const mockCourse = {
  _id: '1',
  name: 'Data Structures and Algorithms',
  code: 'SOFTENG284',
  assessments: [],
  createdAt: new Date()
};

const mockAssessments = [
  {
    _id: '1',
    type: AssessmentType.EXAM,
    year: 2024,
    semester: SemesterType.FIRST,
    questions: [],
    latestContributor: 'user1',
    newestQuestion: null
  },
  {
    _id: '2',
    type: AssessmentType.TEST,
    year: 2024,
    semester: SemesterType.FIRST,
    number: 1,
    questions: [],
    latestContributor: 'user1',
    newestQuestion: null
  },
  {
    _id: '3',
    type: AssessmentType.EXAM,
    year: 2023,
    semester: SemesterType.FIRST,
    questions: []
  },
  {
    _id: '4',
    type: AssessmentType.OTHER,
    year: 2024,
    semester: SemesterType.FIRST,
    name: 'Problem Sheet 1',
    questions: [],
    latestContributor: 'user2',
    newestQuestion: null
  }
];

const axiosMock = new MockAdapter(axios);
const getCourseUrl = new RegExp(`.*${API.getCourse}.*`);
const getCourseAssessmentsUrl = new RegExp(`.*${API.getCourseAssessments}.*`);

beforeEach(() => {
  axiosMock.onGet(getCourseUrl).reply(200, mockCourse);

  axiosMock.onGet(getCourseAssessmentsUrl).reply(200, mockAssessments);
});

afterEach(() => {
  axiosMock.reset();
});
const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

describe('Assessments', () => {
  it('renders course name', async () => {
    renderWithRouter(<Assessments />);

    await waitFor(() => {
      expect(screen.getByText(mockCourse.name)).toBeInTheDocument();
    });
  });

  it('displays the assessments grouped by type', async () => {
    renderWithRouter(<Assessments />);

    await waitFor(() => {
      expect(screen.getByText('Exams')).toBeInTheDocument();
      expect(screen.getByText('Tests')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  it('filters assessments based on the search text', async () => {
    renderWithRouter(<Assessments />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(
        'Search for a past paper'
      );
      fireEvent.change(searchInput, { target: { value: '2023' } });
      expect(screen.queryByText('2024')).not.toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
    });
  });
});
