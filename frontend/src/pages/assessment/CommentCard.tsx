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
  comment: Comment;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const [voteState, setVoteState] = useState<VoteDirection>(
    VoteDirection.NEUTRAL
  );
  const { user, userDb, refreshUserDb } = useAuth();
  const setLoginPopup = useContext(LoginPopupContext);
  const { data: polledComment, refresh: refreshComment } = useGet<Comment>(
    `${API.getComment}/${comment._id}`,
    comment,
    commentMapper
  );
  const { postData: voteComment } = usePost<MakeVoteDTO, Comment>(
    `${API.voteComment}/${comment._id}`
  );
  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${comment.author}`
  );

  useEffect(() => {
    if (userDb) {
      if (userDb.upvotedComments.includes(polledComment!._id)) {
        setVoteState(VoteDirection.UP);
      } else if (userDb.downvotedComments.includes(polledComment!._id)) {
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
    if (polledComment) {
      setVoteState(newVoteDirection);
      oldVoteDirection === VoteDirection.UP && polledComment.rating.upvotes--;
      oldVoteDirection === VoteDirection.DOWN &&
        polledComment.rating.downvotes--;
      newVoteDirection === VoteDirection.UP && polledComment.rating.upvotes++;
      newVoteDirection === VoteDirection.DOWN &&
        polledComment.rating.downvotes++;

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

  if (!polledComment) {
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
        rating={polledComment.rating}
        style={{ display: 'flex', flexDirection: 'column' }}
        onChange={handleVoteChange}
        iconSize="1.1rem"
        voteState={voteState}
      />
      <PersonCard
        avatarPos="top"
        avatarSize="28px"
        name={
          (polledComment.isAnonymous &&
            polledComment?.author === userDb?._id &&
            'Anonymous (You)') ||
          (!polledComment.isAnonymous && author?.name) ||
          'Anonymous'
        }
        style={{ width: '80px' }}
        anonymous={polledComment.isAnonymous}
      />
      <div
        style={{
          padding: '8px',
          width: '100%',
          display: 'flex'
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflowWrap: 'anywhere',
            textAlign: 'start'
          }}
        >
          {polledComment.text}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginLeft: '8px'
          }}
        >
          <p
            style={{
              fontSize: '0.8rem',
              color: '#808080',
              height: 'fit-content'
            }}
          >
            {polledComment.createdAt.toLocaleDateString('en-US', {
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
            {polledComment.createdAt.toLocaleTimeString('en-US', {
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
