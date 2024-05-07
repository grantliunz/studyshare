import { render, screen } from '@testing-library/react';
import { VoteDirection } from '@shared/types/enums/VoteDirection';
import UpDownVote from '../UpDownVote';

describe('UpDownVote', () => {
  const mockRating = {
    upvotes: 10,
    downvotes: 5
  };

  it('displays the correct vote count', () => {
    render(
      <UpDownVote
        rating={mockRating}
        onChange={() => {}}
        voteState={VoteDirection.NEUTRAL}
      />
    );

    const voteCountElement = screen.getByText(
      `${mockRating.upvotes - mockRating.downvotes}`
    );
    expect(voteCountElement).toBeInTheDocument();
  });

  it('displays correct icon when neutral', () => {
    render(
      <UpDownVote
        rating={mockRating}
        onChange={() => {}}
        voteState={VoteDirection.NEUTRAL}
      />
    );

    // Check that the vote state icon is UP outlined
    const isUpvotedIcon = screen.getByTestId('ThumbUpOutlinedIcon');
    expect(isUpvotedIcon).toBeInTheDocument();

    // Check that the vote state icon is DOWN outlined
    const isDownVotedIcon = screen.getByTestId('ThumbDownOutlinedIcon');
    expect(isDownVotedIcon).toBeInTheDocument();
  });

  it('displays correct icon when upvoted', () => {
    render(
      <UpDownVote
        rating={mockRating}
        onChange={() => {}}
        voteState={VoteDirection.UP}
      />
    );

    // Check that the vote state icon is UP filled
    const isUpvotedIcon = screen.getByTestId('ThumbUpIcon');
    expect(isUpvotedIcon).toBeInTheDocument();

    // Check that the vote state icon is DOWN outlined
    const isDownVotedIcon = screen.getByTestId('ThumbDownOutlinedIcon');
    expect(isDownVotedIcon).toBeInTheDocument();
  });

  it('displays correct icon when downvoted', () => {
    render(
      <UpDownVote
        rating={mockRating}
        onChange={() => {}}
        voteState={VoteDirection.DOWN}
      />
    );

    // Check that the vote state icon is UP outlined
    const isUpvotedIcon = screen.getByTestId('ThumbUpOutlinedIcon');
    expect(isUpvotedIcon).toBeInTheDocument();

    // Check that the vote state icon is DOWN filled
    const isDownVotedIcon = screen.getByTestId('ThumbDownIcon');
    expect(isDownVotedIcon).toBeInTheDocument();
  });
});
