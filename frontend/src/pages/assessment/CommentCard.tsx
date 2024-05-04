import PersonCard from '../../components/PersonCard';
import UpDownVote from '../../components/UpDownVote';
import useGet from '../../hooks/useGet';
import { UserDisplayDTO } from '@shared/types/models/user/user';
import API from '../../util/api';
import { Comment } from '@shared/types/models/assessment/assessment';
import { VoteDirection } from '@shared/types/enums/VoteDirection';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/UserContext';
import { LoginPopupContext } from './AssessmentPage';
import { commentMapper } from '../../mappers/commentMapper';
import usePost from '../../hooks/usePost';
import { MakeVoteDTO } from '@shared/types/models/answer/answer';
import { AxiosError } from 'axios';

type CommentCardProps = {
  commentId: string;
};
const CommentCard = ({ commentId }: CommentCardProps) => {
  const [voteState, setVoteState] = useState<VoteDirection>(
    VoteDirection.NEUTRAL
  );
  const { user, userDb, refreshUserDb, userDb: currentUserDb } = useAuth();
  const setLoginPopup = useContext(LoginPopupContext);
  const { data: comment, refresh: refreshComment } = useGet<Comment>(
    `${API.getComment}/${commentId}`,
    null,
    commentMapper
  );
  const { postData: voteComment } = usePost<MakeVoteDTO, Comment>(
    `${API.voteComment}/${commentId}`
  );
  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${comment?.author}`
  );

  useEffect(() => {
    if (userDb) {
      if (userDb.upvotedComments.includes(commentId)) {
        setVoteState(VoteDirection.UP);
      } else if (userDb.downvotedComments.includes(commentId)) {
        setVoteState(VoteDirection.DOWN);
      } else {
        setVoteState(VoteDirection.NEUTRAL);
      }
    }
  }, [userDb]);

  const handleVoteChange = async (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    if (!user || !userDb) {
      setLoginPopup(true);
      return;
    }
    if (comment) {
      setVoteState(newVoteDirection);
      oldVoteDirection === VoteDirection.UP && comment.rating.upvotes--;
      oldVoteDirection === VoteDirection.DOWN && comment.rating.downvotes--;
      newVoteDirection === VoteDirection.UP && comment.rating.upvotes++;
      newVoteDirection === VoteDirection.DOWN && comment.rating.downvotes++;

      const res = await voteComment({
        oldVoteDirection,
        newVoteDirection,
        userId: userDb._id
      });

      if (res instanceof AxiosError) {
        console.log((res.response?.data as { error: string }).error);
        return;
      }
      refreshUserDb();
      refreshComment();
    }
  };

  if (!comment) {
    return <></>;
  }

  return (
    <div
      style={{
        alignItems: 'center',
        columnGap: '8px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        fontSize: '0.7rem',
        position: 'relative' // Add position relative to the parent container
      }}
    >
      <UpDownVote
        rating={comment.rating}
        style={{ display: 'flex', flexDirection: 'column' }}
        onChange={handleVoteChange}
        iconSize="1.1rem"
        voteState={voteState}
      />
      <PersonCard
        avatarPos="top"
        avatarSize="28px"
        name={
          (comment.isAnonymous &&
            comment?.author === currentUserDb?._id &&
            'Anonymous (You)') ||
          (!comment.isAnonymous && author?.name) ||
          'Anonymous'
        }
        style={{ width: '80px' }}
      />
      <div
        style={{
          borderRadius: '8px',
          padding: '8px',
          width: '100%',
          display: 'flex',
          position: 'relative' // Add position relative to the parent container
        }}
      >
        <div style={{ flex: 1, display: 'flex' }}>{comment.text}</div>
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
            {comment.createdAt.toLocaleDateString('en-US', {
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
            {comment.createdAt.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
