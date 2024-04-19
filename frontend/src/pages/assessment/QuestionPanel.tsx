import { IconButton } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { Question } from './Assessment';
import { useState } from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AnswerCard from './AnswerCard';

type QuestionPanelProps = {
  question: Question;
};

const QuestionPanel = ({ question }: QuestionPanelProps) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);

  return (
    <>
      <div
        // header
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <IconButton onClick={() => setIsStarred(!isStarred)}>
          {isStarred ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
        </IconButton>
        {question.number.join('')}
        <IconButton onClick={() => setIsFlagged(!isFlagged)}>
          {isFlagged ? <FlagRoundedIcon /> : <OutlinedFlagRoundedIcon />}
        </IconButton>
      </div>
      <div>{question.text}</div>
      <div
        style={{
          alignItems: 'end',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          padding: '0px 20px'
        }}
      >
        {question.answers.length === 0 ? 'No' : question.answers.length} Answer
        {question.answers.length === 1 ? '' : 's'}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start'
          }}
        >
          Created by
          <PersonCard
            name={question.author}
            avatarPos="left"
            style={{ columnGap: '8px' }}
          />
        </div>
      </div>
      <div style={{ margin: '20px 0px 0px 20px' }}>
        {question.answers.map((answer) => (
          <AnswerCard answer={answer} />
        ))}
      </div>
    </>
  );
};

export default QuestionPanel;
