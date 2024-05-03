import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Rating } from '@shared/types/models/assessment/assessment';
import { VoteDirection } from '@shared/types/enums/VoteDirection';

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

const UpDownVote = ({
  rating,
  style,
  onChange = () => {},
  iconSize = '1.5rem',
  value = VoteDirection.NEUTRAL
}: UpDownVoteProps) => {
  const [voteState, setVoteState] = useState<VoteDirection>(value);
  const [count, setCount] = useState<number>(rating.upvotes - rating.downvotes);

  useEffect(() => {
    setVoteState(value);
  }, [value]);

  useEffect(() => {
    setCount(rating.upvotes - rating.downvotes);
  }, [rating]);

  const handleVote = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    setCount(count - oldVoteDirection + newVoteDirection);
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
      {count}
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
