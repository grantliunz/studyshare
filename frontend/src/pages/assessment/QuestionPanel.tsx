import { IconButton, TextField } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { Question } from './Assessment';
import { useState } from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AnswerCard from './AnswerCard';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

type QuestionPanelProps = {
  question: Question;
};

const QuestionPanel = ({ question }: QuestionPanelProps) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const [newAnswer, setNewAnswer] = useState<string>('');

  const handleNewAnswerChange = (text: string) => {
    setNewAnswer(text);
  };

  const handleNewAnswer = () => {
    console.log(newAnswer);
    // TODO
  };

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
        {question.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} />
        ))}
      </div>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '100px 24px 50px 50px',
          rowGap: '10px',
          alignItems: 'start'
        }}
        onSubmit={(event) => {
          event.preventDefault();
          handleNewAnswer();
        }}
      >
        <p style={{ margin: '0px', fontWeight: '500', fontSize: '1.3rem' }}>
          Your Answer
        </p>
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
          onChange={(event) => handleNewAnswerChange(event.target.value)}
          placeholder="Your answer"
        />
      </form>
    </>
  );
};

export default QuestionPanel;
