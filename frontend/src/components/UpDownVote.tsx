import { IconButton } from '@mui/material';
import { useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Rating } from '../pages/assessment/Assessment';

type UpDownVoteProps = {
  rating: Rating;
  style?: React.CSSProperties;
};

const UpDownVote = ({ rating, style }: UpDownVoteProps) => {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);

  const [isDownvoted, setIsDownvoted] = useState<boolean>(false);

  return (
    <div style={style}>
      <IconButton
        onClick={() => {
          setIsDownvoted(false);
          setIsUpvoted(!isUpvoted);
        }}
      >
        {isUpvoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
      </IconButton>
      {rating.upvotes - rating.downvotes}
      <IconButton
        onClick={() => {
          setIsUpvoted(false);
          setIsDownvoted(!isDownvoted);
        }}
      >
        {isDownvoted ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
      </IconButton>
    </div>
  );
};

export default UpDownVote;
