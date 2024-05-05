import { useLocation, useParams } from 'react-router-dom';
import styles from './AssessmentPage.module.css';
import { createContext, useContext, useEffect, useState } from 'react';
import QuestionPanel from './QuestionPanel';
import QuestionNumber from './QuestionNumber';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  IconButton
} from '@mui/material';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NewQuestion from './NewQuestion/NewQuestion';
import {
  convertRomanToNumber,
  isRomanNumeral
} from '../../util/questionNumber';
import API from '../../util/api';
import useGet from '../../hooks/useGet';
import { arrayEquals } from '../../util/arrays';
import { useAuth } from '../../contexts/UserContext';
import { AssessmentGET } from '@shared/types/models/assessment/assessment';
import LoginPopup from '../../components/LoginPopup/LoginPopup';
import { QuestionLazy } from '@shared/types/models/question/question';
import {
  UpdateWatchListAction,
  UpdateWatchListDTO,
  WatchListType
} from '@shared/types/models/user/user';
import { AxiosError } from 'axios';
import usePut from '../../hooks/usePut';

export type QuestionNode = {
  number: string[];
  subquestions?: QuestionNode[];
  question?: QuestionLazy;
};

export const LoginPopupContext = createContext((bool: boolean) => {});
// Helper function to determine the type of a value (number, letter, or roman numeral)
const getValueType = (value: any) => {
  if (!Number.isNaN(Number(value))) {
    return 'number';
  } else if (typeof value === 'string') {
    if (isRomanNumeral(value)) {
      return 'roman';
    } else if (/^[a-zA-Z]$/.test(value)) {
      return 'letter';
    }
  }
  return 'unknown'; // Default to 'unknown' for unrecognized types
};

const compareLastValues = (a: QuestionNode, b: QuestionNode) => {
  const lastValueA = a.number.at(-1);
  const lastValueB = b.number.at(-1);

  // Determine the type of lastValueA and lastValueB
  const typeA = getValueType(lastValueA);
  const typeB = getValueType(lastValueB);

  if (typeA === 'number' && typeB === 'number') {
    return compareValues(lastValueA, lastValueB, 'number');
  } else if (typeA === 'roman' && typeB === 'roman') {
    return compareValues(lastValueA, lastValueB, 'roman');
  } else {
    return compareValues(lastValueA, lastValueB, 'letter');
  }
};

// Helper function to compare values of the same type (number, letter, or roman numeral)
const compareValues = (valueA: any, valueB: any, type: string) => {
  if (type === 'number') {
    return valueA - valueB;
  } else if (type === 'roman') {
    // Compare Roman numerals using their numerical values
    const numericValueA = convertRomanToNumber(valueA);
    const numericValueB = convertRomanToNumber(valueB);
    return numericValueA - numericValueB;
  } else {
    // Compare letters based on their ASCII codes
    return valueA.localeCompare(valueB);
  }
};

const buildQuestionsTree = (questions: QuestionLazy[]) => {
  // could use a map of visited for efficiency
  const root: QuestionNode = { number: [] };
  questions.forEach((question) => {
    let currentRoot = root;
    const hierarchy = question.number;
    for (let i = 0; i < hierarchy.length; i++) {
      const currHierarchy = hierarchy.slice(0, i + 1);
      const node = currentRoot.subquestions
        ? currentRoot.subquestions.find((questionNode) =>
            arrayEquals(questionNode.number, currHierarchy)
          )
        : undefined;
      if (!node) {
        const newNode =
          i === hierarchy.length - 1
            ? { number: currHierarchy, question }
            : { number: currHierarchy };
        if (currentRoot.subquestions) {
          currentRoot.subquestions.push(newNode);
          currentRoot.subquestions =
            currentRoot.subquestions.sort(compareLastValues);
        } else {
          currentRoot.subquestions = [newNode];
        }
        currentRoot = newNode;
      } else {
        if (i === hierarchy.length - 1) {
          node.question = question;
        }
        currentRoot = node;
      }
    }
  });
  return root;
};

// builds a sorted array of questions
const buildOrderedQuestionsArray = (root: QuestionNode) => {
  const arr: QuestionLazy[] = [];

  const traverseNode = (node: QuestionNode) => {
    if (node.question) {
      arr.push(node.question);
    }
    if (node.subquestions) {
      node.subquestions.forEach((subQn) => traverseNode(subQn));
    }
  };

  traverseNode(root);
  return arr;
};

const AssessmentPage = () => {
  const { assessmentId } = useParams();
  const { user: currentUser, userDb, refreshUserDb } = useAuth();
  const { putData: updateWatchList } = usePut<UpdateWatchListDTO, null>(
    `${API.updateWatchList}/${userDb?._id}`
  );
  const setLoginPopup = useContext(LoginPopupContext);

  const location = useLocation();
  const { quest: questionID } = location.state ?? {};
  const {
    data: assessment,
    isLoading: isFetchingAssessment,
    refresh: refreshAssessment
  } = useGet<AssessmentGET>(`${API.getAssessment}/${assessmentId}`);

  const [isStarred, setIsStarred] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionLazy>();
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentNumber, setNewQuestionParentNumber] = useState<
    string[]
  >([]);
  const [rootNode, setRootNode] = useState<QuestionNode>({ number: [] });
  const [orderedQuestionsArray, setOrderedQuestionsArray] = useState<
    QuestionLazy[]
  >([]);
  const [reportedQuestions, setReportedQuestions] = useState<QuestionLazy[]>(
    []
  );
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (assessment) {
      const reported = assessment.questions.filter((q) =>
        userDb?.reported.includes(q._id)
      );
      setReportedQuestions(reported);
      const root = buildQuestionsTree(
        assessment.questions.filter((q) => !reported.includes(q))
      );
      setRootNode(root);
      const arr = buildOrderedQuestionsArray(root);
      const newOrderedQuestionsArray = arr.concat(reported);
      setOrderedQuestionsArray(newOrderedQuestionsArray);
      if (questionID) {
        const question = newOrderedQuestionsArray.find(
          (qn) => qn._id === questionID
        );
        setCurrentQuestion(question);
      } else {
        setCurrentQuestion(arr.length > 0 ? arr[0] : undefined);
      }
      if (userDb) {
        setIsStarred(
          userDb.watchList.find(
            (entry) => entry.watchedId === assessment._id
          ) !== undefined
        );
      }
    }
  }, [JSON.stringify(userDb?.reported), assessment, questionID]);

  const handleIsStarredChange = async (newValue: boolean) => {
    if (!currentUser || !userDb) {
      setShowLoginPopup(true);
      return;
    }
    setIsStarred(newValue);

    const res = await updateWatchList({
      watchedId: assessment!._id!, // can change this later
      action: newValue
        ? UpdateWatchListAction.WATCH
        : UpdateWatchListAction.UNWATCH,
      watchType: WatchListType.ASSESSMENT
    });

    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }

    refreshUserDb();
  };

  const handleAddQuestion = (parentNumber: string[]) => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    setNewQuestionParentNumber(parentNumber);
    setNewQuestionOpen(true);
  };

  const handleNewQuestionClose = () => {
    setNewQuestionOpen(false);
    setNewQuestionParentNumber([]);
  };

  if (isFetchingAssessment) {
    return <CircularProgress style={{ margin: 'auto' }} />;
  }

  const handleResize = (e: MouseEvent) => {
    e.preventDefault();
    if (e.clientX > 120 && e.clientX < 800) {
      setSidebarWidth(e.clientX);
    }
  };

  const stopResize = () => {
    window.removeEventListener('mousemove', handleResize);
  };

  const startResize = () => {
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResize);
  };

  return (
    <LoginPopupContext.Provider value={setShowLoginPopup}>
      <div className={styles.container}>
        {!assessment || !rootNode ? (
          <div>Error retrieving assessment details</div>
        ) : (
          <>
            <div
              className={styles.questionsTabContainer}
              style={{
                minWidth: sidebarWidth,
                maxWidth: sidebarWidth
              }}
            >
              <div style={{ flexDirection: 'row', display: 'flex' }}>
                <h3
                  style={{
                    display: 'flex',
                    textAlign: 'start',
                    margin: '8px 0px 0px 8px'
                  }}
                >
                  Questions
                </h3>
                <IconButton
                  onClick={() => handleIsStarredChange(!isStarred)}
                  title={
                    !isStarred
                      ? 'Add assessment to watchlist'
                      : 'Remove assessment from watchlist'
                  }
                  style={{
                    marginLeft: 'auto',
                    marginRight: '8px',
                    marginTop: '4px'
                  }}
                >
                  {isStarred ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
                </IconButton>
              </div>
              {rootNode.subquestions && rootNode.subquestions.length > 0 ? (
                rootNode.subquestions.map((question) => (
                  <QuestionNumber
                    key={question.number.join(',')}
                    questionNode={question}
                    setQuestion={setCurrentQuestion}
                    currentQuestion={currentQuestion}
                    handleAddQuestion={handleAddQuestion}
                  />
                ))
              ) : (
                <p
                  style={{
                    alignSelf: 'center',
                    placeSelf: 'center',
                    width: '100%'
                  }}
                >
                  Create a question to get started!
                </p>
              )}
              <IconButton
                size="medium"
                style={{
                  alignSelf: 'center',
                  marginTop: '8px'
                }}
                onClick={() => handleAddQuestion([])}
                title="Add question"
              >
                <AddIcon fontSize="medium" />
              </IconButton>
              {reportedQuestions.length > 0 && (
                <Accordion
                  aria-controls="panel1-content"
                  id="panel1-header"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    border: 'none',
                    opacity: 0.5
                  }}
                  elevation={0}
                  sx={{ '&:before': { height: '0px' } }}
                  disableGutters
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Hidden Questions
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    {reportedQuestions.map((q) => {
                      return (
                        <div
                          key={q.number.join('')}
                          className={styles.reportedQuestionNumber}
                          onClick={() => {
                            setCurrentQuestion(q);
                          }}
                          style={{
                            backgroundColor:
                              currentQuestion?._id === q._id
                                ? 'rgba(0,0,0,0.1)'
                                : 'transparent'
                          }}
                        >
                          {q.number.join('')}
                        </div>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              )}
            </div>
            <div
              className={styles.resizeBar}
              onMouseDown={startResize}
              onMouseUp={stopResize}
            />
            {currentQuestion ? (
              orderedQuestionsArray.map((question, index) => (
                <QuestionPanel
                  key={question.number.join()}
                  currentQuestion={currentQuestion}
                  question={question}
                  prevQuestion={
                    index > 0 ? orderedQuestionsArray[index - 1] : undefined
                  }
                  nextQuestion={
                    index < orderedQuestionsArray.length - 1
                      ? orderedQuestionsArray[index + 1]
                      : undefined
                  }
                  setQuestion={setCurrentQuestion}
                />
              ))
            ) : (
              <p
                style={{
                  alignSelf: 'center',
                  placeSelf: 'center',
                  width: '100%'
                }}
              >
                Create a question to get started!
              </p>
            )}
            <NewQuestion
              open={newQuestionOpen}
              handleClose={handleNewQuestionClose}
              parentNumber={newQuestionParentNumber}
              onAddQuestion={() => {
                refreshAssessment();
                handleNewQuestionClose();
              }}
            />
          </>
        )}
      </div>
      <LoginPopup open={showLoginPopup} setOpen={setShowLoginPopup} />
    </LoginPopupContext.Provider>
  );
};

export default AssessmentPage;
