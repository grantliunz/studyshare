import { Button, IconButton, TextField } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { QuestionWithFullNumber } from './Assessment';
import { useState } from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AnswerCard from './AnswerCard';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

type QuestionPanelProps = {
  questionWithFullNumber: QuestionWithFullNumber;
  prevQuestionWithFullNumber: QuestionWithFullNumber | undefined;
  nextQuestionWithFullNumber: QuestionWithFullNumber | undefined;
  setQuestion: React.Dispatch<
    React.SetStateAction<QuestionWithFullNumber | undefined>
  >;
};

const QuestionPanel = ({
  questionWithFullNumber,
  prevQuestionWithFullNumber,
  nextQuestionWithFullNumber,
  setQuestion
}: QuestionPanelProps) => {
  const { question, fullNumber } = questionWithFullNumber;

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
      <div style={{ marginTop: '10px', overflow: 'hidden' }}>
        {prevQuestionWithFullNumber && (
          <Button
            onClick={() => setQuestion(prevQuestionWithFullNumber)}
            startIcon={<ArrowBackRoundedIcon />}
            style={{ float: 'left' }}
          >
            {prevQuestionWithFullNumber?.fullNumber}
          </Button>
        )}
        {nextQuestionWithFullNumber && (
          <Button
            onClick={() => setQuestion(nextQuestionWithFullNumber)}
            endIcon={<ArrowForwardRoundedIcon />}
            style={{ float: 'right' }}
          >
            {nextQuestionWithFullNumber?.fullNumber}
          </Button>
        )}
      </div>
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
        {fullNumber}
        <IconButton onClick={() => setIsFlagged(!isFlagged)}>
          {isFlagged ? <FlagRoundedIcon /> : <OutlinedFlagRoundedIcon />}
        </IconButton>
      </div>
      <div>{question.content?.text}</div>
      <div
        style={{
          alignItems: 'end',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          padding: '0px 20px'
        }}
      >
        {question.content!.answers.length === 0
          ? 'No'
          : question.content!.answers.length}{' '}
        Answer
        {question.content!.answers.length === 1 ? '' : 's'}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start'
          }}
        >
          Created by
          <PersonCard
            name={question.content!.author}
            avatarPos="left"
            style={{ columnGap: '8px' }}
          />
        </div>
      </div>
      <div style={{ margin: '20px 0px 0px 20px' }}>
        {question.content!.answers.map((answer, index) => (
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
