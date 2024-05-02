import PersonCard from '../../components/PersonCard';
import UpDownVote, { VoteDirection } from '../../components/UpDownVote';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CommentCard from './CommentCard';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ReactQuill from 'react-quill';
import { Answer, Comment, CreateCommentDTO } from '../../types/assessment';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import { AxiosError } from 'axios';
import useGet from '../../hooks/useGet';
import { UserDisplayDTO } from '../../types/user';
import { useAuth } from '../../contexts/UserContext';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const [newComment, setNewComment] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: polledAnswer, refresh: refreshAnswer } = useGet<Answer>(
    `${API.getAnswer}/${answer._id}`
  );

  const handleVoteChange = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    if (polledAnswer) {
      oldVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes--;
      oldVoteDirection === VoteDirection.DOWN &&
        polledAnswer.rating.downvotes--;
      newVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes++;
      newVoteDirection === VoteDirection.DOWN &&
        polledAnswer.rating.downvotes++;
    }
  };

  const handleAddCommentChange = (text: string) => {
    setNewComment(text);
  };

  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${answer.author}`
  );

  const { postData: postComment } = usePost<CreateCommentDTO, Comment>(
    `${API.createComment}/${answer._id}`
  );

  const { user: currentUser, userDb: currentUserDb, refreshUserDb } = useAuth();

  const handleCreateNewComment = async () => {
    if (!currentUser || !currentUserDb) {
      alert('You must be logged in to make a comment!');
      return;
    }
    const comment: CreateCommentDTO = {
      text: newComment,
      author: currentUserDb._id,
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
    setNewComment('');
    setIsExpanded(true);
    refreshAnswer();
    refreshUserDb();
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
            name={(!answer.isAnonymous && author?.name) || 'Anonymous'}
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
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  padding: '0px'
                }}
              >
                {isExpanded ? (
                  <ExpandMoreRoundedIcon />
                ) : (
                  <KeyboardArrowRightRoundedIcon />
                )}
              </IconButton>{' '}
              Comments {polledAnswer.comments.length}
            </div>
            <div
              style={{
                display: isExpanded ? 'flex' : 'none',
                columnGap: '16px',
                padding: '4px 0px'
              }}
            >
              <div
                style={{
                  border: '1px dashed black',
                  marginLeft: '11px',
                  width: '0px'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '4px'
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
                <IconButton disabled={newComment.trim() === ''} type="submit">
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
            value={newComment}
          />
        </form>
      </div>
    </div>
  );
};

export default AnswerCard;
