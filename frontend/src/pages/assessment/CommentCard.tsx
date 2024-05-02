import PersonCard from '../../components/PersonCard';
import UpDownVote, { VoteDirection } from '../../components/UpDownVote';
import useGet from '../../hooks/useGet';
import { Comment } from '../../types/assessment';
import { UserDisplayDTO } from '../../types/user';
import API from '../../util/api';

type CommentCardProps = {
  comment: Comment;
};
const CommentCard = ({ comment }: CommentCardProps) => {
  const handleVoteChange = (
    oldVoteDirection: VoteDirection,
    newVoteDirection: VoteDirection
  ) => {
    oldVoteDirection === VoteDirection.UP && comment.rating.upvotes--;
    oldVoteDirection === VoteDirection.DOWN && comment.rating.downvotes--;
    newVoteDirection === VoteDirection.UP && comment.rating.upvotes++;
    newVoteDirection === VoteDirection.DOWN && comment.rating.downvotes++;
  };

  const { data: author } = useGet<UserDisplayDTO>(
    `${API.getUser}/${comment.author}`
  );
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
      />
      <PersonCard
        avatarPos="top"
        avatarSize="28px"
        name={author?.name || 'Anonymous'}
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
