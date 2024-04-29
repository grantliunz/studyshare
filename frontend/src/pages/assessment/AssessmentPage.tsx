import { useParams } from 'react-router-dom';
import styles from './Assessment.module.css';
import { useEffect, useState } from 'react';
import QuestionPanel from './QuestionPanel';
import QuestionNumber from './QuestionNumber';
import { Button, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewQuestion from './NewQuestion/NewQuestion';
import { findNextQuestionNumber } from '../../util/questionNumber';
import { arrayEquals } from '../../util/arrays';
import { useAuth } from '../../contexts/UserContext';
import API from '../../util/api';
import usePost from '../../hooks/usePost';
import { Assessment, Question } from '../../types/assessment';
import { dummyAssessment } from './dummyAssessment';
import useGet from '../../hooks/useGet';

export type QuestionWithFullNumber = {
  question: Question;
  hierarchy: string[];
};

const buildOrderedQuestionsArray = (questions: Question[]) => {
  const result: QuestionWithFullNumber[] = [];
  questions.forEach((qn) => traverseSubQuestion(result, qn, [qn.number]));
  return result;
};

const traverseSubQuestion = (
  result: QuestionWithFullNumber[],
  question: Question,
  currentHierarchy: string[]
) => {
  if (question.content) {
    return result.push({
      question,
      hierarchy: currentHierarchy
    });
  } else
    question.subquestions!.forEach((qn) =>
      traverseSubQuestion(result, qn, [...currentHierarchy, qn.number])
    );
};

const AssessmentPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [assessmentId, setAssessmentId] = useState<string>(
    '662f489ffb97d36123d48ee7'
  );
  const {
    data: polledAssessment,
    isLoading: isFetchingAssessment,
    refresh: refreshAssessment
  } = useGet<Assessment>(`${API.getAssessment}/${assessmentId}`, null);

  console.log(polledAssessment);
  // const [assessment, setAssessment] = useState<Assessment>(dummyAssessment);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithFullNumber>();

  const [orderedQuestionsArray, setOrderedQuestionsArray] =
    useState<QuestionWithFullNumber[]>();
  if (polledAssessment) {
    setOrderedQuestionsArray(
      buildOrderedQuestionsArray(polledAssessment.questions)
    );
  }
  const [prevQuestion, setPrevQuestion] = useState<
    QuestionWithFullNumber | undefined
  >(undefined);
  const [nextQuestion, setNextQuestion] = useState<
    QuestionWithFullNumber | undefined
  >(undefined);
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentHierarchy, setNewQuestionParentHierarchy] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (currentQuestion && orderedQuestionsArray) {
      const currIndex = orderedQuestionsArray.findIndex((question) =>
        arrayEquals(question.hierarchy, currentQuestion.hierarchy)
      );

      setPrevQuestion(
        currIndex > 0 ? orderedQuestionsArray[currIndex - 1] : undefined
      );

      setNextQuestion(
        currIndex < orderedQuestionsArray.length - 1
          ? orderedQuestionsArray[currIndex + 1]
          : undefined
      );
    } else {
      setNextQuestion(undefined);
      setPrevQuestion(undefined);
    }
  }, [
    currentQuestion?.hierarchy.join(''),
    polledAssessment?.id,
    orderedQuestionsArray
  ]);

  const handleAddQuestion = (parentHierarchy: string[]) => {
    setNewQuestionParentHierarchy(parentHierarchy);
    setNewQuestionOpen(true);
  };

  const handleNewQuestionClose = () => {
    setNewQuestionOpen(false);
    setNewQuestionParentHierarchy([]);
  };

  const handleSubmitAnswer = (
    questionWithFullNumber: QuestionWithFullNumber,
    answer: string
  ) => {
    if (polledAssessment) {
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

  // DELETE
  const {
    postData: addAssessment,
    isLoading: isAddingAssessment,
    error: addAssessmentError
  } = usePost<Assessment, Assessment>(`${API.postAssessment}/${id}`);

  const handleAddAssessment = async () => {
    if (id) {
      const addedAssessment = await addAssessment(dummyAssessment);
      console.log(addedAssessment);
    }
  };

  if (isFetchingAssessment) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.container}>
      {!polledAssessment || !orderedQuestionsArray ? (
        <div>Error!</div>
      ) : (
        <>
          <div className={styles.questionsTabContainer}>
            <Button onClick={() => handleAddAssessment()}>Click me</Button>
            {polledAssessment.questions.map((question) => (
              <QuestionNumber
                key={question.number}
                question={question}
                parentNumbers={[question.number]}
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
            orderedQuestionsArray.map((question) => (
              <QuestionPanel
                key={question.hierarchy.join('')}
                currentQuestion={currentQuestion}
                questionWithFullNumber={question}
                prevQuestionWithFullNumber={prevQuestion}
                nextQuestionWithFullNumber={nextQuestion}
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
          {polledAssessment.questions.length > 0 && (
            <NewQuestion
              open={newQuestionOpen}
              handleClose={handleNewQuestionClose}
              parent={newQuestionParentHierarchy}
              defaultQuestionNumber={findNextQuestionNumber(
                newQuestionParentHierarchy,
                polledAssessment.questions
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssessmentPage;
