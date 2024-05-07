import '@testing-library/jest-dom';
import { describe, expect, it, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import API from '../../../util/api';
import AnswerCard from '../AnswerCard';
import { Answer } from '@shared/types/models/answer/answer';
import { UserDisplayDTO } from '@shared/types/models/user/user';

describe('AnswerCard', () => {
  const mockAnswer: Answer = {
    _id: '123',
    text: 'This is the answer text',
    createdAt: new Date(),
    comments: [],
    rating: {
      upvotes: 2,
      downvotes: 5
    },
    author: '123'
  };

  const mockAuthor: UserDisplayDTO = {
    name: 'John Doe'
  };

  // Mock Axios requests
  const axiosMock = new MockAdapter(axios);

  beforeAll(() => {});

  const answerUrl = new RegExp(`.*${API.getAnswer}/${mockAnswer._id}$`);
  const authorUrl = new RegExp(`.*${API.getUser}/${mockAnswer.author}$`);

  beforeEach(() => {
    // Mock GET request to fetch answer data
    axiosMock.onGet(answerUrl).reply(200, mockAnswer);

    // MOCK GET request to fetch author data
    axiosMock.onGet(authorUrl).reply(200, mockAuthor);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('displays the answer text', async () => {
    // Render the AnswerCard component
    render(<AnswerCard answer={mockAnswer} />);

    // Wait for the component to finish rendering and display the answer text
    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(answerUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();
      const answerTextElement = screen.getByText(mockAnswer.text);
      expect(answerTextElement).toBeInTheDocument();
    });
  });

  it('displays the author name', async () => {
    // Render the AnswerCard component
    render(<AnswerCard answer={mockAnswer} />);

    // Wait for the component to finish rendering and display the answer text
    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(answerUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();
      const authorNameElement = screen.getByText(mockAuthor.name);
      expect(authorNameElement).toBeInTheDocument();
    });
  });

  it('displays vote count', async () => {
    render(<AnswerCard answer={mockAnswer} />);

    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(answerUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();

      // Check if the vote count is displayed
      const voteCountElement = screen.getByText(
        `${mockAnswer.rating.upvotes - mockAnswer.rating.downvotes}`
      );
      expect(voteCountElement).toBeInTheDocument();
    });
  });

  it('displays created at date', async () => {
    render(<AnswerCard answer={mockAnswer} />);

    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(answerUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();

      // Check if the vote count is displayed
      const createdAtDate = screen.getByText(
        mockAnswer.createdAt.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      );
      expect(createdAtDate).toBeInTheDocument();
    });
  });
});
