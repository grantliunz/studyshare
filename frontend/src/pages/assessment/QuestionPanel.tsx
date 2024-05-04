import { Button, CircularProgress, IconButton } from '@mui/material';
import PersonCard from '../../components/PersonCard';
import { useContext, useEffect, useState } from 'react';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import AnswerCard from './AnswerCard';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NewAnswer from './NewAnswer/NewAnswer';
import ReactQuill from 'react-quill';
import useGet from '../../hooks/useGet';
import API from '../../util/api';
import {
  UpdateWatchListAction,
  UpdateWatchListDTO
} from '@shared/types/models/user/user';
import usePut from '../../hooks/usePut';
import { AxiosError } from 'axios';
import { useAuth } from '../../contexts/UserContext';
import { Question } from '@shared/types/models/question/question';
import { QuestionLazy } from '@shared/types/models/assessment/assessment';
import { LoginPopupContext } from './AssessmentPage';

type QuestionPanelProps = {
  currentQuestion: QuestionLazy;
  question: QuestionLazy;
  prevQuestion: QuestionLazy | undefined;
  nextQuestion: QuestionLazy | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionLazy | undefined>>;
};

const QuestionPanel = ({
  currentQuestion,
  question,
  prevQuestion,
  nextQuestion,
  setQuestion
}: QuestionPanelProps) => {
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isFlagged, setIsFlagged] = useState<boolean>(false);
  const setLoginPopup = useContext(LoginPopupContext);

  const { data: polledQuestion, refresh: refreshQuestion } = useGet<Question>(
    `${API.getQuestion}/${question._id}`
  );

  const { user: userAuth, userDb, refreshUserDb } = useAuth();

  const { putData: updateWatchList } = usePut<UpdateWatchListDTO, null>(
    `${API.updateWatchList}/${userDb?._id}`
  );

  useEffect(() => {
    if (userDb) {
      setIsStarred(
        userDb.watchList.find((entry) => entry.questionId === question._id) !==
          undefined
      );
    }
  }, [userDb]);

  const handleIsStarredChange = async (newValue: boolean) => {
    if (!userAuth || !userDb) {
      setLoginPopup(true);
      return;
    }
    setIsStarred(newValue);

    const res = await updateWatchList({
      questionId: question._id,
      action: newValue
        ? UpdateWatchListAction.WATCH
        : UpdateWatchListAction.UNWATCH
    });

    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }

    refreshUserDb();
  };

  if (!polledQuestion) {
    return (
      <div
        hidden={currentQuestion._id !== question._id}
        style={{ width: '100%', placeSelf: 'center' }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      hidden={currentQuestion._id !== question._id}
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          <IconButton onClick={() => handleIsStarredChange(!isStarred)}>
            {isStarred ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
          </IconButton>
          <h2 style={{ margin: '0px', flexGrow: '1', textAlign: 'start' }}>
            {polledQuestion.number}
          </h2>
          <IconButton onClick={() => setIsFlagged(!isFlagged)}>
            {isFlagged ? <FlagRoundedIcon /> : <OutlinedFlagRoundedIcon />}
          </IconButton>
        </div>
        <ReactQuill
          style={{
            overflow: 'hidden',
            height: 'fit-content',
            border: '1px solid #B0B0B0',
            borderRadius: '5px',
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '20px',
          alignItems: 'center'
        }}
      >
        {polledQuestion.answers
          .sort(
            (a, b) =>
              b.rating.upvotes -
              b.rating.downvotes -
              (a.rating.upvotes - a.rating.downvotes)
          )
          .map((answer, index) => (
            <AnswerCard key={index} answer={answer} />
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
