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
        fontSize: '0.7rem'
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
      {comment.text}
    </div>
  );
};

export default CommentCard;
