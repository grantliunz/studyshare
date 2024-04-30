import { useParams } from 'react-router-dom';
import styles from './AssessmentPage.module.css';
import { useEffect, useState } from 'react';
import QuestionPanel from './QuestionPanel';
import QuestionNumber from './QuestionNumber';
import { CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewQuestion from './NewQuestion/NewQuestion';
import { findNextQuestionNumber } from '../../util/questionNumber';
import { useAuth } from '../../contexts/UserContext';
import API from '../../util/api';
import { Assessment, Question } from '../../types/assessment';
import useGet from '../../hooks/useGet';

export type QuestionNode = {
  number: string;
  subquestions?: QuestionNode[];
  question?: Question;
};

const buildQuestionsTree = (questions: Question[]) => {
  // could use a map of visited for efficiency
  const root: QuestionNode = { number: 'root' };
  questions.forEach((question) => {
    let currentRoot = root;
    const hierarchy = question.number;
    for (const [index, level] of hierarchy.entries()) {
      const node = currentRoot.subquestions
        ? currentRoot.subquestions.find(
            (questionNode) => questionNode.number === level
          )
        : undefined;
      if (!node) {
        const newNode =
          index === hierarchy.length - 1
            ? { number: level, question }
            : { number: level };
        if (currentRoot.subquestions) {
          currentRoot.subquestions.push(newNode);
        } else {
          currentRoot.subquestions = [newNode];
        }
        currentRoot = newNode;
      } else {
        currentRoot = node;
      }
    }
  });

  return root;
};

const AssessmentPage = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const {
    data: assessment,
    isLoading: isFetchingAssessment,
    refresh: refreshAssessment
  } = useGet<Assessment>(`${API.getAssessment}/${id}`);

  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  // const [orderedQuestionsArray, setOrderedQuestionsArray] =
  //   useState<Question[]>();
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentHierarchy, setNewQuestionParentHierarchy] = useState<
    string[]
  >([]);

  const [rootNode, setRootNode] = useState<QuestionNode>({ number: 'root' });

  useEffect(() => {
    if (assessment) {
      setRootNode(buildQuestionsTree(assessment.questions));
    }
  }, [assessment]);

  const handleAddQuestion = (parentHierarchy: string[]) => {
    setNewQuestionParentHierarchy(parentHierarchy);
    setNewQuestionOpen(true);
  };

  const handleNewQuestionClose = () => {
    setNewQuestionOpen(false);
    setNewQuestionParentHierarchy([]);
  };

  const handleSubmitAnswer = (questionWithFullNumber: any, answer: string) => {
    if (assessment) {
      const newAnswer = {
        text: answer,
        author: user?.email || 'Anonymous',
        rating: {
          id: '1',
          upvotes: 0,
          downvotes: 0
        },
        comments: [],
        timestamp: new Date().toISOString()
      };
      questionWithFullNumber.question.content?.answers.push(newAnswer);
      // setAssessment({
      //   ...polledAssessment
      // });
    }
  };

  if (isFetchingAssessment) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.container}>
      {!assessment || !rootNode ? (
        <div>Error retrieving assessment details</div>
      ) : (
        <>
          <div className={styles.questionsTabContainer}>
            <h3 style={{ margin: '0px' }}>Questions</h3>
            {rootNode.subquestions &&
              rootNode.subquestions.map((question) => (
                <QuestionNumber
                  key={question.number}
                  questionNode={question}
                  setQuestion={setCurrentQuestion}
                  currentQuestion={currentQuestion}
                  handleAddQuestion={handleAddQuestion}
                />
              ))}
            <IconButton
              size="small"
              style={{
                alignSelf: 'center',
                border: '1px solid black',
                borderRadius: '5px',
                marginTop: '8px'
              }}
              onClick={() => handleAddQuestion([])}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
          {currentQuestion ? (
            assessment.questions.map((question, index) => (
              <QuestionPanel
                key={question.number.join()}
                currentQuestion={currentQuestion}
                question={question}
                prevQuestion={
                  index > 0 ? assessment.questions[index - 1] : undefined
                }
                nextQuestion={
                  index < assessment.questions.length - 1
                    ? assessment.questions[index + 1]
                    : undefined
                }
                setQuestion={setCurrentQuestion}
                handleSubmitAnswer={handleSubmitAnswer}
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
              Click a question to get started!
            </p>
          )}

          {/* <NewQuestion
            open={newQuestionOpen}
            handleClose={handleNewQuestionClose}
            parent={newQuestionParentHierarchy}
            defaultQuestionNumber={
              assessment.questions.length > 0
                ? findNextQuestionNumber(
                    newQuestionParentHierarchy,
                    assessment.questions
                  )
                : '1'
            }
          /> */}
        </>
      )}
    </div>
  );
};

export default AssessmentPage;
