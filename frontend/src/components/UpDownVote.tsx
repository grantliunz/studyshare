import { IconButton } from '@mui/material';
import { useState } from 'react';
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
  voteState: VoteDirection;
};

const UpDownVote = ({
  rating,
  style,
  onChange = () => {},
  iconSize = '1.5rem',
  voteState
}: UpDownVoteProps) => {
  const [isUpvoteButtonDisabled, setIsUpvoteButtonDisabled] =
    useState<boolean>(false);
  const [isDownvoteButtonDisabled, setIsDownvoteButtonDisabled] =
    useState<boolean>(false);

  const handleVote = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    onChange(oldVoteDirection, newVoteDirection);
  };

  return (
    <div style={style}>
      <IconButton
        disabled={isUpvoteButtonDisabled}
        onClick={() => {
          setIsUpvoteButtonDisabled(true);
          setTimeout(() => {
            setIsUpvoteButtonDisabled(false);
          }, 300);
          handleVote(
            voteState,
            voteState === VoteDirection.UP
              ? VoteDirection.NEUTRAL
              : VoteDirection.UP
          );
        }}
        title="Upvote"
        style={{
          margin: '0',
          padding: '0'
        }}
      >
        {voteState === VoteDirection.UP ? (
          <ThumbUpIcon style={{ fontSize: iconSize }} />
        ) : (
          <ThumbUpOutlinedIcon style={{ fontSize: iconSize }} />
        )}
      </IconButton>
      {rating.upvotes - rating.downvotes}
      <IconButton
        disabled={isDownvoteButtonDisabled}
        onClick={() => {
          setIsDownvoteButtonDisabled(true);
          setTimeout(() => {
            setIsDownvoteButtonDisabled(false);
          }, 300);
          handleVote(
            voteState,
            voteState === VoteDirection.DOWN
              ? VoteDirection.NEUTRAL
              : VoteDirection.DOWN
          );
        }}
        title="Downvote"
        style={{
          margin: '0',
          padding: '0'
        }}
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
