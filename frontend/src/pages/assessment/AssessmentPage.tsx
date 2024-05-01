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
import API from '../../util/api';
import { AssessmentGET, QuestionGET } from '../../types/assessment';
import useGet from '../../hooks/useGet';
import { arrayEquals } from '../../util/arrays';
import { useAuth } from '../../contexts/UserContext';

export type QuestionNode = {
  number: string[];
  subquestions?: QuestionNode[];
  question?: QuestionGET;
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

const buildQuestionsTree = (questions: QuestionGET[]) => {
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
  const arr: QuestionGET[] = [];

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
  const { universityId, courseId, assessmentId } = useParams();
  const { user: currentUser } = useAuth();

  const {
    data: assessment,
    isLoading: isFetchingAssessment,
    refresh: refreshAssessment
  } = useGet<AssessmentGET>(`${API.getAssessment}/${assessmentId}`);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionGET>();
  const [newQuestionOpen, setNewQuestionOpen] = useState(false);
  const [newQuestionParentNumber, setNewQuestionParentNumber] = useState<
    string[]
  >([]);
  const [rootNode, setRootNode] = useState<QuestionNode>({ number: [] });
  const [orderedQuestionsArray, setOrderedQuestionsArray] = useState<
    QuestionGET[]
  >([]);

  useEffect(() => {
    if (assessment) {
      const root = buildQuestionsTree(assessment.questions);
      setRootNode(root);
      setOrderedQuestionsArray(buildOrderedQuestionsArray(root));
    }
  }, [assessment]);

  const handleAddQuestion = (parentNumber: string[]) => {
    if (!currentUser) {
      alert('You must be logged in to make a question!');
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

  return (
    <>
      <div>
        <h2>test</h2>
      </div>

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
    </>
  );
};

export default AssessmentPage;
