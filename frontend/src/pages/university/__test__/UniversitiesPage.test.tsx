import {
  RenderOptions,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { AuthProvider } from '../../../contexts/UserContext';
import UniversitiesPage from '../UniversitiesPage';
import API from '../../../util/api';
import { MemoryRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';

const server = setupServer(
  http.get(`*${API.getUniversities}`, () => {
    return HttpResponse.json(
      [
        {
          _id: '1',
          name: 'University 1',
          image: '1',
          courses: [],
          createdAt: { seconds: 1633977600 }
        },
        {
          _id: '2',
          name: 'University 2',
          image: '2',
          courses: [],
          createdAt: { seconds: 1633977600 }
        }
      ],
      { status: 200 }
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

describe('UniversitiesPage', () => {
  it('renders universities correctly', async () => {
    render(<UniversitiesPage />);

    expect(screen.getByText('Universities')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search for a university')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('University 1')).toBeInTheDocument();
      expect(screen.getByText('University 2')).toBeInTheDocument();
    });
  });

  it('filters universities based on search query', async () => {
    render(<UniversitiesPage />);

    const searchInput = screen.getByPlaceholderText('Search for a university');
    userEvent.type(searchInput, 'University 1');

    await waitFor(() => {
      expect(screen.getByText('University 1')).toBeInTheDocument();
      expect(screen.queryByText('University 2')).not.toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', () => {
    render(<UniversitiesPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message when fetching data fails', async () => {
    server.use(
      http.get(`*${API.getUniversities}`, () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    render(<UniversitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
