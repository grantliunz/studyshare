import { Answer } from './Assessment';
import PersonCard from '../../components/PersonCard';
import UpDownVote, { VoteDirection } from '../../components/UpDownVote';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CommentCard from './CommentCard';
import { IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const [newComment, setNewComment] = useState<string>('');

  const handleVoteChange = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    oldVoteDirection === VoteDirection.UP && answer.rating.upvotes--;
    oldVoteDirection === VoteDirection.DOWN && answer.rating.downvotes--;
    newVoteDirection === VoteDirection.UP && answer.rating.upvotes++;
    newVoteDirection === VoteDirection.DOWN && answer.rating.downvotes++;
  };

  const handleAddCommentChange = (text: string) => {
    setNewComment(text);
  };

  const handleCreateNewComment = () => {
    console.log(newComment);
    // TODO
  };

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', columnGap: '16px' }}>
        <UpDownVote
          rating={answer.rating}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '30px'
          }}
          onChange={handleVoteChange}
        />
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#d9d9d9',
            columnGap: '24px',
            display: 'flex',
            width: '100%',
            padding: '12px'
          }}
        >
          <PersonCard
            name={answer.author}
            avatarSize="36px"
            style={{ alignItems: 'center' }}
          />
          {answer.text}
        </div>
      </div>
      <div style={{ marginLeft: '46px' }}>
        {answer.comments.length > 0 && (
          <>
            <div style={{ display: 'flex' }}>
              <KeyboardArrowDownOutlinedIcon /> Comments{' '}
              {answer.comments.length}
            </div>
            <div
              style={{
                display: 'flex',
                columnGap: '20px',
                padding: '10px 0px'
              }}
            >
              <div
                style={{
                  border: '1px dashed black',
                  marginLeft: '11px',
                  width: '1px'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '20px'
                }}
              >
                {answer.comments.map((comment, i) => (
                  <CommentCard key={i} comment={comment} />
                ))}
              </div>
            </div>
          </>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateNewComment();
          }}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton type="submit">
                  <SendOutlinedIcon />
                </IconButton>
              )
            }}
            multiline
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleAddCommentChange(event.target.value)
            }
            placeholder="Add a comment"
            size="small"
            style={{
              alignSelf: 'start',
              display: 'flex',
              justifySelf: 'start',
              margin: '4px'
            }}
          />
        </form>
      </div>
    </>
  );
};

export default AnswerCard;
