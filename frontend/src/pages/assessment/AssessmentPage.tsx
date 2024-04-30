import { useParams } from 'react-router-dom';
import styles from './AssessmentPage.module.css';
import { useEffect, useState } from 'react';
import QuestionPanel from './QuestionPanel';
import QuestionNumber from './QuestionNumber';
import { CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewQuestion from './NewQuestion/NewQuestion';
import {
  convertRomanToNumber,
  isRomanNumeral
} from '../../util/questionNumber';
import { useAuth } from '../../contexts/UserContext';
import API from '../../util/api';
import { Assessment, Question } from '../../types/assessment';
import useGet from '../../hooks/useGet';
import { arrayEquals } from '../../util/arrays';

export type QuestionNode = {
  number: string[];
  subquestions?: QuestionNode[];
  question?: Question;
};

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

const buildQuestionsTree = (questions: Question[]) => {
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
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentNumber, setNewQuestionParentNumber] = useState<
    string[]
  >([]);
  const [rootNode, setRootNode] = useState<QuestionNode>({ number: [] });

  useEffect(() => {
    if (assessment) {
      setRootNode(buildQuestionsTree(assessment.questions));
    }
  }, [assessment]);

  const handleAddQuestion = (parentNumber: string[]) => {
    setNewQuestionParentNumber(parentNumber);
    setNewQuestionOpen(true);
  };

  const handleNewQuestionClose = () => {
    setNewQuestionOpen(false);
    setNewQuestionParentNumber([]);
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
                  key={question.number.join(',')}
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
  );
};

export default AssessmentPage;
