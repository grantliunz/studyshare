import { Button, IconButton } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { QuestionWithFullNumber } from './Assessment';
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

type QuestionPanelProps = {
  currentQuestion: QuestionWithFullNumber;
  questionWithFullNumber: QuestionWithFullNumber;
  prevQuestionWithFullNumber: QuestionWithFullNumber | undefined;
  nextQuestionWithFullNumber: QuestionWithFullNumber | undefined;
  setQuestion: React.Dispatch<
    React.SetStateAction<QuestionWithFullNumber | undefined>
  >;
  handleSubmitAnswer: (
    questionWithFullNumber: QuestionWithFullNumber,
    answer: string
  ) => any;
};

const QuestionPanel = ({
  currentQuestion,
  questionWithFullNumber,
  prevQuestionWithFullNumber,
  nextQuestionWithFullNumber,
  setQuestion,
  handleSubmitAnswer
}: QuestionPanelProps) => {
  const { question, hierarchy } = questionWithFullNumber;
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);

  return (
    <div
      hidden={
        !arrayEquals(
          currentQuestion.hierarchy,
          questionWithFullNumber.hierarchy
        )
      }
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <div style={{ paddingTop: '10px', display: 'flex' }}>
        {prevQuestionWithFullNumber && (
          <Button
            onClick={() => setQuestion(prevQuestionWithFullNumber)}
            startIcon={<ArrowBackRoundedIcon />}
            style={{ textTransform: 'none', marginRight: 'auto' }}
          >
            {prevQuestionWithFullNumber?.hierarchy.join('')}
          </Button>
        )}
        {nextQuestionWithFullNumber && (
          <Button
            onClick={() => setQuestion(nextQuestionWithFullNumber)}
            endIcon={<ArrowForwardRoundedIcon />}
            style={{ textTransform: 'none', marginLeft: 'auto' }}
          >
            {nextQuestionWithFullNumber?.hierarchy.join('')}
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
        <h2 style={{ margin: '0px' }}>{hierarchy}</h2>
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
      <div style={{ margin: '20px' }}>
        {question.content!.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} />
        ))}
      </div>
      <div
        style={{ height: '500px', padding: '30px 20px', marginBottom: '100px' }}
      >
        <NewAnswer
          handleSubmitAnswer={(answer: string) =>
            handleSubmitAnswer(questionWithFullNumber, answer)
          }
        />
      </div>
    </div>
  );
};

export default QuestionPanel;
