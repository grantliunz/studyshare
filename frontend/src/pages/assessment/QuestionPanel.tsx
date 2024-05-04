import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Slider
} from '@mui/material';
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
  UpdateReportedAction,
  UpdateReportedDTO,
  UpdateWatchListAction,
  UpdateWatchListDTO
} from '@shared/types/models/user/user';
import usePut from '../../hooks/usePut';
import { AxiosError } from 'axios';
import { useAuth } from '../../contexts/UserContext';
import {
  CreateQuestionVersionEntryDTO,
  Question,
  QuestionLazy
} from '@shared/types/models/question/question';
import { LoginPopupContext } from './AssessmentPage';
import { questionMapper } from '../../mappers/questionMapper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import Editor from '../../components/Editor/Editor';

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
  const [versionNo, setVersionNo] = useState<number>(-1);
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [newVersionText, setNewVersionText] = useState<string>('');
  const [isEditQuestionAnonymous, setIsEditQuestionAnonymous] =
    useState<boolean>(false);

  const { data: polledQuestion, refresh: refreshQuestion } = useGet<Question>(
    `${API.getQuestion}/${question._id}`,
    null,
    questionMapper
  );

  const { user: userAuth, userDb, refreshUserDb } = useAuth();

  const { putData: updateWatchList } = usePut<UpdateWatchListDTO, null>(
    `${API.updateWatchList}/${userDb?._id}`
  );
  const { putData: updateReported } = usePut<UpdateReportedDTO, null>(
    `${API.updateReported}/${userDb?._id}`
  );

  const { putData: createQuestionVersion } = usePut<
    CreateQuestionVersionEntryDTO,
    QuestionLazy
  >(`${API.createQuestionVersion}/${question._id}`);
  useEffect(() => {
    if (userDb) {
      setIsStarred(
        userDb.watchList.find((entry) => entry.questionId === question._id) !==
          undefined
      );
      setIsFlagged(userDb.reported.includes(question._id));
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

  const handleIsFlaggedChanged = async (newValue: boolean) => {
    if (!userAuth || !userDb) {
      setLoginPopup(true);
      return;
    }
    setIsFlagged(newValue);

    const res = await updateReported({
      questionId: question._id,
      action: newValue
        ? UpdateReportedAction.REPORT
        : UpdateReportedAction.UNREPORT
    });

    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }

    refreshUserDb();
  };

  const toggleIsEditingQuestion = () => {
    if (!userAuth || !userDb) {
      setLoginPopup(true);
      return;
    }
    if (isEditingQuestion) {
      setNewVersionText('');
    } else {
      setNewVersionText(
        polledQuestion ? polledQuestion?.versions.at(versionNo)!.text : ''
      );
    }
    setIsEditingQuestion(!isEditingQuestion);
  };

  const handleEditQuestion = async () => {
    if (!userDb) {
      return;
    }
    const res = await createQuestionVersion({
      author: userDb._id,
      createdAt: new Date(),
      isAnonymous: isEditQuestionAnonymous,
      text: newVersionText
    });

    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }

    toggleIsEditingQuestion();
    refreshQuestion();
    setVersionNo(-1);
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
          <IconButton onClick={() => toggleIsEditingQuestion()}>
            {isEditingQuestion ? <EditOffOutlinedIcon /> : <EditOutlinedIcon />}
          </IconButton>
          <IconButton onClick={() => handleIsFlaggedChanged(!isFlagged)}>
            {isFlagged ? <FlagRoundedIcon /> : <OutlinedFlagRoundedIcon />}
          </IconButton>
        </div>
        {polledQuestion.versions.length > 1 && (
          <div style={{ padding: '0px 50px' }}>
            <Slider
              aria-label="Question version history"
              defaultValue={-1}
              marks={polledQuestion.versions.map((_version, index) => ({
                value: -1 * index - 1,
                label: index === 0 ? 'latest version' : ''
              }))}
              max={-1}
              min={-polledQuestion.versions.length}
              onChange={(_event, value) => setVersionNo(value as number)}
              size="small"
              step={1}
              value={versionNo}
              valueLabelDisplay="off"
            />
          </div>
        )}
        {isEditingQuestion ? (
          <>
            <div
              style={{
                overflow: 'hidden',
                borderRadius: '5px',
                margin: '0px 10px 10px 10px',
                height: '200px'
              }}
            >
              <Editor value={newVersionText} setValue={setNewVersionText} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: '30px',
                justifyContent: 'center'
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleEditQuestion()}
                style={{
                  width: 'fit-content',
                  textTransform: 'none',
                  backgroundColor: '#41709b'
                }}
              >
                Submit Question
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEditQuestionAnonymous} // Pass the value of isAnonymous to the checked prop
                    onChange={(event) =>
                      setIsEditQuestionAnonymous(event.target.checked)
                    }
                  />
                }
                label="Submit Anonymously"
              />
            </div>
          </>
        ) : (
          <ReactQuill
            style={{
              overflow: 'hidden',
              height: 'fit-content',
              border: '1px solid #B0B0B0',
              borderRadius: '5px',
              margin: '10px',
              minHeight: '100px'
            }}
            value={
              polledQuestion.versions.at(versionNo)?.text || 'an error occured'
            }
            readOnly={true}
            theme={'bubble'}
          />
        )}
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
              name={
                (polledQuestion.versions.at(versionNo)?.isAnonymous &&
                  polledQuestion.versions.at(versionNo)?.author._id ===
                    userDb?._id &&
                  'Anonymous (You)') ||
                (!polledQuestion.versions.at(versionNo)?.isAnonymous &&
                  polledQuestion.versions.at(versionNo)?.author?.name) ||
                'Anonymous'
              }
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
          .map((answer) => (
            <AnswerCard key={answer._id} answer={answer} />
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
