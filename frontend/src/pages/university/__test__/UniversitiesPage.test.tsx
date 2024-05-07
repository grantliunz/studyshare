import {
  RenderOptions,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../../contexts/UserContext';
import UniversitiesPage from '../UniversitiesPage';
import API from '../../../util/api';
import { MemoryRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';
import { describe, expect, it, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { University } from '@shared/types/models/university/university';

const mockUniversities: University[] = [
  {
    id: '1',
    name: 'University 1',
    image: '1',
    courses: [],
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'University 2',
    image: '2',
    courses: [],
    createdAt: new Date()
  }
];

const axiosMock = new MockAdapter(axios);
const getUniversityUrl = new RegExp(`.*${API.getUniversities}.*`);

beforeEach(() => {
  axiosMock.onGet(getUniversityUrl).reply(200, mockUniversities);
});

afterEach(() => {
  axiosMock.reset();
});

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
    axiosMock.onGet(getUniversityUrl).reply(500);

    render(<UniversitiesPage />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
