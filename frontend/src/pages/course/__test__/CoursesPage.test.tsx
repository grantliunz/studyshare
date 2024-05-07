import {
  RenderOptions,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, PathParams, http } from 'msw';
import { setupServer } from 'msw/node';
import { AuthProvider } from '../../../contexts/UserContext';
import CoursesPage from '../CoursesPage';
import API from '../../../util/api';
import { MemoryRouter, Params } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';
import { vi, it, expect } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: (): Readonly<Params<string>> => ({ universityId: '1' })
  };
});

const server = setupServer(
  http.get<PathParams>(`*${API.getCourses}/:universityId`, ({ params }) => {
    const { universityId } = params;
    return HttpResponse.json(
      [
        {
          _id: 'c1',
          name: 'Course 1',
          code: 'CS100',
          university: '1',
          assessments: [],
          createdAt: { seconds: 1633977600 }
        },
        {
          _id: 'c2',
          name: 'Course 2',
          code: 'CS200',
          university: '1',
          assessments: [],
          createdAt: { seconds: 1633977600 }
        }
      ],
      { status: 200 }
    );
  }),
  http.get(`*${API.getUniversityById}/:universityId`, ({ params }) => {
    const { universityId } = params;
    return HttpResponse.json(
      {
        _id: universityId,
        name: 'University Name',
        image: 'image.png',
        courses: ['c1', 'c2'],
        createdAt: { seconds: 1633977600 },
        updatedAt: { seconds: 1633977600 },
        __v: 4
      },
      { status: 200 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithRouter = (
  ui: ReactElement,
  initialRoute: string,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
    </AuthProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

describe('CoursesPage', () => {
  it('renders courses correctly', async () => {
    renderWithRouter(<CoursesPage />, '/1');
    expect(screen.getByText('University Name')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search for a course')
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.getByText('Course 2')).toBeInTheDocument();
    });
  });

  it('filters courses based on search query', async () => {
    renderWithRouter(<CoursesPage />, '/1');
    const searchInput = screen.getByPlaceholderText('Search for a course');
    userEvent.type(searchInput, 'Course 1');
    await waitFor(() => {
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.queryByText('Course 2')).not.toBeInTheDocument();
    });
  });

  it('filters courses based on year level', async () => {
    renderWithRouter(<CoursesPage />, '/1');
    userEvent.click(screen.getByText('Select Year'));
    userEvent.click(screen.getByText('100'));
    await waitFor(() => {
      expect(screen.getByText('Course 1')).toBeInTheDocument();
      expect(screen.queryByText('Course 2')).not.toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', () => {
    renderWithRouter(<CoursesPage />, '/1');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // it('displays error message when fetching data fails', async () => {
  //   server.use(
  //     http.get(`*${API.getCourses}/:universityId`, () => {
  //       return HttpResponse.json(null, { status: 500 });
  //     })
  //   );
  //   renderWithRouter(<CoursesPage />, '/1');
  //   await waitFor(() => {
  //     expect(screen.getByText('An error occurred')).toBeInTheDocument();
  //   });
  // });
});
