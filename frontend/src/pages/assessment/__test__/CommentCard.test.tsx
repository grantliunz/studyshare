import '@testing-library/jest-dom';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import API from '../../../util/api';
import { UserDisplayDTO } from '@shared/types/models/user/user';
import { Comment } from '@shared/types/models/assessment/assessment';
import CommentCard from '../CommentCard';

describe('CommentCard', () => {
  const mockComment: Comment = {
    _id: '123',
    answer: '12345',
    text: 'This is the comment text',
    createdAt: new Date(),
    rating: {
      upvotes: 10,
      downvotes: 2
    },
    author: '999'
  };

  const mockCommentAnonymous: Comment = {
    _id: '123',
    answer: '12345',
    text: 'This is the comment text',
    createdAt: new Date(),
    rating: {
      upvotes: 10,
      downvotes: 2
    },
    author: '999',
    isAnonymous: true
  };

  const mockAuthor: UserDisplayDTO = {
    name: 'John Doe'
  };

  // Mock Axios requests
  const axiosMock = new MockAdapter(axios);
  const commentUrl = new RegExp(`.*${API.getComment}/${mockComment._id}$`);
  const authorUrl = new RegExp(`.*${API.getUser}/${mockComment.author}$`);

  beforeEach(() => {
    // Mock GET request to fetch answer data
    axiosMock.onGet(commentUrl).reply(200, mockComment);

    // MOCK GET request to fetch author data
    axiosMock.onGet(authorUrl).reply(200, mockAuthor);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('displays the answer text', async () => {
    // Render the CommentCard component
    render(<CommentCard comment={mockComment} />);

    // Wait for the component to finish rendering and display the answer text
    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(commentUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();
      const answerTextElement = screen.getByText(mockComment.text);
      expect(answerTextElement).toBeInTheDocument();
    });
  });

  it('displays the author name', async () => {
    // Render the CommentCard component
    render(<CommentCard comment={mockComment} />);

    // Wait for the component to finish rendering and display the answer text
    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(commentUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();
      const authorNameElement = screen.getByText(mockAuthor.name);
      expect(authorNameElement).toBeInTheDocument();
    });
  });

  it('displays vote count', async () => {
    // Render the CommentCard component
    render(<CommentCard comment={mockComment} />);

    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(commentUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();

      // Check if the vote count is displayed
      const voteCountElement = screen.getByText(
        `${mockComment.rating.upvotes - mockComment.rating.downvotes}`
      );
      expect(voteCountElement).toBeInTheDocument();
    });
  });

  it('displays created at date', async () => {
    // Render the CommentCard component
    render(<CommentCard comment={mockComment} />);

    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(commentUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();

      // Check if the createdAt date is displayed
      const createdAtDate = screen.getByText(
        mockComment.createdAt.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      );
      expect(createdAtDate).toBeInTheDocument();
    });
  });

  it('displays anonymous author', async () => {
    axiosMock.onGet(commentUrl).reply(200, mockCommentAnonymous);

    // Render the CommentCard component
    render(<CommentCard comment={mockCommentAnonymous} />);

    await waitFor(() => {
      expect(
        axiosMock.history.get.find((req) => req.url?.match(commentUrl))
      ).toBeTruthy();
      expect(
        axiosMock.history.get.find((req) => req.url?.match(authorUrl))
      ).toBeTruthy();

      // check that author name is not displayed
      expect(screen.queryByText(mockAuthor.name)).not.toBeInTheDocument();

      // Check if anonymous is displayed
      expect(
        within(screen.getByTestId('person-card')).getByText('Anonymous')
      ).toBeInTheDocument();
    });
  });
});
