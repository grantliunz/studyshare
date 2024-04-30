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

  const {
    data: assessment,
    isLoading: isFetchingAssessment,
    refresh: refreshAssessment
  } = useGet<Assessment>(`${API.getAssessment}/${id}`);

  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithFullNumber>();
  const [orderedQuestionsArray, setOrderedQuestionsArray] =
    useState<QuestionWithFullNumber[]>();
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentHierarchy, setNewQuestionParentHierarchy] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (assessment) {
      setOrderedQuestionsArray(
        buildOrderedQuestionsArray(assessment.questions)
      );
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

  const handleSubmitAnswer = (
    questionWithFullNumber: QuestionWithFullNumber,
    answer: string
  ) => {
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
      {!assessment || !orderedQuestionsArray ? (
        <div>Error retrieving assessment details</div>
      ) : (
        <>
          <div className={styles.questionsTabContainer}>
            <h3>Questions</h3>
            {assessment.questions.map((question) => (
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
            orderedQuestionsArray.map((question, index) => (
              <QuestionPanel
                key={question.hierarchy.join('')}
                currentQuestion={currentQuestion}
                questionWithFullNumber={question}
                prevQuestionWithFullNumber={
                  index > 0 ? orderedQuestionsArray[index - 1] : undefined
                }
                nextQuestionWithFullNumber={
                  index < orderedQuestionsArray.length - 1
                    ? orderedQuestionsArray[index + 1]
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

          <NewQuestion
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
          />
        </>
      )}
    </div>
  );
};

export default AssessmentPage;
