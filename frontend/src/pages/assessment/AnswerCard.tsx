import { Answer } from './Assessment';
import PersonCard from '../../components/PersonCard';
import UpDownVote from '../../components/UpDownVote';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = ({ answer }: AnswerCardProps) => {
  return (
    <>
      <div style={{ display: 'flex', columnGap: '16px', alignItems: 'center' }}>
        <UpDownVote
          rating={answer.rating}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '30px'
          }}
        />
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#d9d9d9',
            display: 'flex',
            width: '100%',
            padding: '12px',
            columnGap: '10px'
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
                  width: '1px',
                  marginLeft: '11px'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '20px'
                }}
              >
                {answer.comments.map((comment) => (
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
                    />
                    <PersonCard
                      avatarPos="top"
                      avatarSize="28px"
                      name={comment.author}
                      style={{ width: '80px' }}
                    />
                    {comment.text}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AnswerCard;
