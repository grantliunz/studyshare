import { IconButton } from '@mui/material';
import { useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Rating } from '../pages/assessment/AssessmentPage';

type UpDownVoteProps = {
  rating: Rating;
  style?: React.CSSProperties;
  onChange?: (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => any;
};

export enum VoteDirection {
  UP = 1,
  DOWN = -1,
  NEUTRAL = 0
}

const UpDownVote = ({
  rating,
  style,
  onChange = () => {}
}: UpDownVoteProps) => {
  const [voteState, setVoteState] = useState<VoteDirection>(
    VoteDirection.NEUTRAL
  );

  const handleVote = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    setVoteState(newVoteDirection);
    onChange(oldVoteDirection, newVoteDirection);
  };

  return (
    <div style={style}>
      <IconButton
        onClick={() =>
          handleVote(
            voteState,
            voteState === VoteDirection.UP
              ? VoteDirection.NEUTRAL
              : VoteDirection.UP
          )
        }
      >
        {voteState === VoteDirection.UP ? (
          <ThumbUpIcon />
        ) : (
          <ThumbUpOutlinedIcon />
        )}
      </IconButton>
      {rating.upvotes - rating.downvotes}
      <IconButton
        onClick={() =>
          handleVote(
            voteState,
            voteState === VoteDirection.DOWN
              ? VoteDirection.NEUTRAL
              : VoteDirection.DOWN
          )
        }
      >
        {voteState === VoteDirection.DOWN ? (
          <ThumbDownIcon />
        ) : (
          <ThumbDownOutlinedIcon />
        )}
      </IconButton>
    </div>
  );
};

export default UpDownVote;
