import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Rating } from '@shared/types/models/assessment/assessment';

type UpDownVoteProps = {
  rating: Rating;
  style?: React.CSSProperties;
  onChange?: (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => any;
  iconSize?: string;
  value?: VoteDirection;
};

export enum VoteDirection {
  UP = 1,
  DOWN = -1,
  NEUTRAL = 0
}

const UpDownVote = ({
  rating,
  style,
  onChange = () => {},
  iconSize = '1.5rem',
  value = VoteDirection.NEUTRAL
}: UpDownVoteProps) => {
  const [voteState, setVoteState] = useState<VoteDirection>(value);

  useEffect(() => {
    setVoteState(value);
  }, [value]);

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
          <ThumbUpIcon style={{ fontSize: iconSize }} />
        ) : (
          <ThumbUpOutlinedIcon style={{ fontSize: iconSize }} />
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
          <ThumbDownIcon style={{ fontSize: iconSize }} />
        ) : (
          <ThumbDownOutlinedIcon style={{ fontSize: iconSize }} />
        )}
      </IconButton>
    </div>
  );
};

export default UpDownVote;
