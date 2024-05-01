import { Button, CircularProgress, IconButton } from '@mui/material';
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
import useGet from '../../hooks/useGet';
import API from '../../util/api';
import { UserDisplayDTO } from '../../types/user';

type QuestionPanelProps = {
  currentQuestion: Question;
  question: Question;
  prevQuestion: Question | undefined;
  nextQuestion: Question | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  refreshAssessment: Function;
};

const QuestionPanel = ({
  currentQuestion,
  question,
  prevQuestion,
  nextQuestion,
  setQuestion,
  refreshAssessment
}: QuestionPanelProps) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);

  const { data: polledQuestion, refresh: refreshQuestion } = useGet<Question>(
    `${API.getQuestion}/${question._id}`
  );

  if (!polledQuestion) {
    return (
      <div
        hidden={!arrayEquals(currentQuestion.number, question.number)}
        style={{ overflow: 'hidden', width: '100%' }}
      >
        <CircularProgress />
      </div>
    );
  }

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
        <h2 style={{ margin: '0px' }}>{polledQuestion.number}</h2>
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
        value={polledQuestion.text}
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
        {polledQuestion.answers.length === 0
          ? 'No'
          : polledQuestion.answers.length}{' '}
        Answer
        {polledQuestion.answers.length === 1 ? '' : 's'}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start'
          }}
        >
          Created by
          <PersonCard
            name={polledQuestion.author.name}
            avatarPos="left"
            style={{ columnGap: '8px' }}
          />
        </div>
      </div>
      <div style={{ margin: '20px' }}>
        {polledQuestion.answers.map((answer, index) => (
          <AnswerCard
            key={index}
            answer={answer}
            onCreateComment={refreshAssessment}
          />
        ))}
      </div>
      <div
        style={{ height: '300px', padding: '30px 20px', marginBottom: '100px' }}
      >
        <NewAnswer
          questionId={polledQuestion._id}
          onSubmitAnswer={refreshQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionPanel;
