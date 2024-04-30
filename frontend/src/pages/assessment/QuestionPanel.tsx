import { Button, IconButton } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { useState } from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AnswerCard from './AnswerCard';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NewAnswer from './NewAnswer/NewAnswer';
import { arrayEquals } from '../../util/arrays';
import { Question } from '../../types/assessment';
import ReactQuill from 'react-quill';

type QuestionPanelProps = {
  currentQuestion: Question;
  question: Question;
  prevQuestion: Question | undefined;
  nextQuestion: Question | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  handleSubmitAnswer: (question: Question, answer: string) => any;
};

const QuestionPanel = ({
  currentQuestion,
  question,
  prevQuestion,
  nextQuestion,
  setQuestion,
  handleSubmitAnswer
}: QuestionPanelProps) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);

  return (
    <div
      hidden={!arrayEquals(currentQuestion.number, question.number)}
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <div style={{ paddingTop: '10px', display: 'flex' }}>
        {prevQuestion && (
          <Button
            onClick={() => setQuestion(prevQuestion)}
            startIcon={<ArrowBackRoundedIcon />}
            style={{ textTransform: 'none', marginRight: 'auto' }}
          >
            {prevQuestion?.number.join('')}
          </Button>
        )}
        {nextQuestion && (
          <Button
            onClick={() => setQuestion(nextQuestion)}
            endIcon={<ArrowForwardRoundedIcon />}
            style={{ textTransform: 'none', marginLeft: 'auto' }}
          >
            {nextQuestion.number.join('')}
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
        <h2 style={{ margin: '0px' }}>{question.number}</h2>
        <IconButton onClick={() => setIsFlagged(!isFlagged)}>
          {isFlagged ? <FlagRoundedIcon /> : <OutlinedFlagRoundedIcon />}
        </IconButton>
      </div>
      <ReactQuill
        style={{
          overflow: 'hidden',
          height: 'fit-content',
          border: '1px solid #B0B0B0',
          borderRadius: '10px',
          margin: '10px',
          minHeight: '100px'
        }}
        value={question.text}
        readOnly={true}
        theme={'bubble'}
      />
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
      <div style={{ margin: '20px' }}>
        {question.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} />
        ))}
      </div>
      <div
        style={{ height: '300px', padding: '30px 20px', marginBottom: '100px' }}
      >
        <NewAnswer
          handleSubmitAnswer={(answer: string) =>
            handleSubmitAnswer(question, answer)
          }
        />
      </div>
    </div>
  );
};

export default QuestionPanel;
