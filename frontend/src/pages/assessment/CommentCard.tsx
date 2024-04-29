import PersonCard from '../../components/PersonCard';
import UpDownVote, { VoteDirection } from '../../components/UpDownVote';
import { Comment } from './AssessmentPage';

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

  return (
    <div
      style={{
        alignItems: 'center',
        columnGap: '20px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        fontSize: '0.7rem'
      }}
    >
      <UpDownVote
        rating={comment.rating}
        style={{ display: 'flex', flexDirection: 'column' }}
        onChange={handleVoteChange}
      />
      <PersonCard
        avatarPos="top"
        avatarSize="28px"
        name={comment.author}
        style={{ width: '80px' }}
      />
      {comment.text}
    </div>
  );
};

export default CommentCard;
