import PersonCard from '../../components/PersonCard';
import UpDownVote, { VoteDirection } from '../../components/UpDownVote';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CommentCard from './CommentCard';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ReactQuill from 'react-quill';
import { Answer, Comment } from '../../types/assessment';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import { AxiosError } from 'axios';
import useGet from '../../hooks/useGet';
import { UserDisplayDTO } from '../../types/user';

type AnswerCardProps = {
  answer: Answer;
  onCreateComment?: Function;
};

const AnswerCard = ({
  answer,
  onCreateComment = () => {}
}: AnswerCardProps) => {
  const [newComment, setNewComment] = useState<string>('');

  const { data: polledAnswer, refresh: refreshAnswer } = useGet<Answer>(
    `${API.getAnswer}/${answer._id}`
  );

  const handleVoteChange = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    // oldVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes--;
    // oldVoteDirection === VoteDirection.DOWN && polledAnswer.rating.downvotes--;
    // newVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes++;
    // newVoteDirection === VoteDirection.DOWN && polledAnswer.rating.downvotes++;
  };

  const handleAddCommentChange = (text: string) => {
    setNewComment(text);
  };

  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${answer.author}`
  );

  const { postData: postComment } = usePost<Omit<Comment, '_id'>, Comment>(
    `${API.createComment}/${answer._id}`
  );

  // temp to add an author to new answer
  const { data: users } = useGet<any>(`${API.getAllUsers}`);

  const handleCreateNewComment = async () => {
    const comment: Omit<Comment, '_id'> = {
      text: newComment,
      author: users[Math.floor(Math.random() * users.length)]._id,
      rating: {
        upvotes: 0,
        downvotes: 0
      }
    };
    const res = await postComment(comment);
    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }
    refreshAnswer();
  };

  if (!polledAnswer) {
    return <CircularProgress />;
  }

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          alignItems: 'center',
          columnGap: '12px',
          display: 'flex'
        }}
      >
        <UpDownVote
          rating={polledAnswer.rating}
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
            columnGap: '16px',
            display: 'flex',
            width: '100%',
            overflow: 'hidden',
            padding: '0px 12px'
          }}
        >
          <PersonCard
            name={author?.name || 'Anonymous'}
            avatarSize="32px"
            style={{ alignItems: 'center', fontSize: '0.8rem' }}
          />
          <ReactQuill
            style={{ overflow: 'hidden', height: 'fit-content' }}
            value={polledAnswer.text}
            readOnly={true}
            theme={'bubble'}
          />
        </div>
      </div>
      <div style={{ marginLeft: '46px' }}>
        {polledAnswer.comments.length > 0 && (
          <>
            <div style={{ display: 'flex' }}>
              <KeyboardArrowDownOutlinedIcon /> Comments{' '}
              {polledAnswer.comments.length}
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
                  rowGap: '12px'
                }}
              >
                {polledAnswer.comments.map((comment, i) => (
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
    </div>
  );
};

export default AnswerCard;
