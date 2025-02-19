import PersonCard from '../../components/PersonCard';
import UpDownVote from '../../components/UpDownVote';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CommentCard from './CommentCard';
import { CircularProgress, IconButton, TextField } from '@mui/material';
import React, { useEffect, useContext, useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ReactQuill from 'react-quill';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import { AxiosError } from 'axios';
import useGet from '../../hooks/useGet';
import { UserDisplayDTO } from '@shared/types/models/user/user';
import { useAuth } from '../../contexts/UserContext';
import { Answer, MakeVoteDTO } from '@shared/types/models/answer/answer';
import { answerMapper } from '../../mappers/answerMapper';
import { CreateCommentDTO } from '@shared/types/models/assessment/assessment';
import { LoginPopupContext } from './AssessmentPage';
import { VoteDirection } from '@shared/types/enums/VoteDirection';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const [newComment, setNewComment] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [anonymousComment, setAnonymousComment] = useState<boolean>(false);
  const [voteDirection, setVoteDirection] = useState<VoteDirection>(
    VoteDirection.NEUTRAL
  );

  const { postData: postComment } = usePost<CreateCommentDTO, Comment>(
    `${API.createComment}/${answer._id}`
  );

  const { user: currentUser, userDb, refreshUserDb } = useAuth();

  const setLoginPopup = useContext(LoginPopupContext);

  const { data: polledAnswer, refresh: refreshAnswer } = useGet<Answer>(
    `${API.getAnswer}/${answer._id}`,
    answer,
    answerMapper
  );

  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${answer.author}`
  );

  const { postData: voteAnswer } = usePost<MakeVoteDTO, Answer>(
    `${API.voteAnswer}/${answer._id}`
  );

  useEffect(() => {
    if (userDb) {
      if (userDb.upvotedAnswers.includes(answer._id)) {
        setVoteDirection(VoteDirection.UP);
      } else if (userDb.downvotedAnswers.includes(answer._id)) {
        setVoteDirection(VoteDirection.DOWN);
      } else {
        setVoteDirection(VoteDirection.NEUTRAL);
      }
    }
  }, [userDb]);

  const handleVoteChange = async (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    if (!currentUser || !userDb) {
      setLoginPopup(true);
      return;
    }
    if (polledAnswer) {
      oldVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes--;
      oldVoteDirection === VoteDirection.DOWN &&
        polledAnswer.rating.downvotes--;
      newVoteDirection === VoteDirection.UP && polledAnswer.rating.upvotes++;
      newVoteDirection === VoteDirection.DOWN &&
        polledAnswer.rating.downvotes++;

      setVoteDirection(newVoteDirection);
      const res = await voteAnswer({
        oldVoteDirection,
        newVoteDirection,
        userId: userDb._id
      });

      if (res instanceof AxiosError) {
        console.log((res.response?.data as { error: string }).error);
        return;
      }
      refreshUserDb();
      refreshAnswer();
    }
  };

  const handleAddCommentChange = (text: string) => {
    setNewComment(text);
  };

  const handleCreateNewComment = async () => {
    if (!currentUser || !userDb) {
      setLoginPopup(true);
      return;
    }
    const comment: CreateCommentDTO = {
      text: newComment,
      author: userDb._id,
      rating: {
        upvotes: 0,
        downvotes: 0
      },
      isAnonymous: anonymousComment
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
    <div style={{ width: '100%' }}>
      <div
        style={{
          alignItems: 'center',
          columnGap: '12px',
          display: 'flex',
          padding: '4px 0px'
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
          voteState={voteDirection}
        />
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#d9d9d9',
            columnGap: '16px',
            display: 'flex',
            width: '100%',
            overflow: 'hidden',
            borderRadius: '10px',
            padding: '0px 12px',
            position: 'relative'
          }}
        >
          <PersonCard
            name={
              (answer.isAnonymous &&
                answer.author === userDb?._id &&
                'Anonymous (You)') ||
              (!answer.isAnonymous && author?.name) ||
              'Anonymous'
            }
            avatarSize="32px"
            style={{ alignItems: 'center', fontSize: '0.8rem' }}
            anonymous={answer.isAnonymous}
          />
          <ReactQuill
            style={{ overflow: 'hidden', height: 'fit-content', flexGrow: 1 }}
            value={polledAnswer.text}
            readOnly={true}
            theme={'bubble'}
          />
          <div
            style={{
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              position: 'relative', // Add position rel
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end' // Align content to the end of the column
              }}
            >
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#808080',
                  height: 'fit-content'
                }}
              >
                {polledAnswer.createdAt.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#808080',
                  height: 'fit-content'
                }}
              >
                {polledAnswer.createdAt.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
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
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ExpandMoreRoundedIcon />
                ) : (
                  <KeyboardArrowRightRoundedIcon />
                )}
              </IconButton>
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
                  rowGap: '4px',
                  width: '100%'
                }}
              >
                {polledAnswer.comments.map((comment, i) => (
                  <div
                    key={comment._id}
                    style={{
                      backgroundColor: i % 2 === 0 ? '#d9d9d9' : '#e0e0e0',
                      padding: '8px',
                      borderRadius: '10px'
                    }}
                  >
                    <CommentCard comment={comment} />
                  </div>
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
            flexDirection: 'column' // Changed to column for better layout
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              endAdornment: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'end'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label
                      htmlFor="anonymousCheckbox"
                      style={{
                        fontSize: '0.8rem'
                      }}
                    >
                      Anonymous
                    </label>
                    <input
                      type="checkbox"
                      onChange={(event) => {
                        setAnonymousComment(event.target.checked);
                      }}
                    />
                  </div>
                  <IconButton
                    disabled={newComment.trim() === ''}
                    type="submit"
                    style={{ padding: '5px 5px 0 0', margin: '0 0 0 5px' }}
                  >
                    <SendOutlinedIcon />
                  </IconButton>
                </div>
              ),
              style: {
                padding: '4pxpx 8px'
              }
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
