import { Button, IconButton } from '@mui/material';
import { Question } from '../../types/assessment';
import { useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { QuestionNode } from './AssessmentPage';

type QuestionNumberProps = {
  questionNode: QuestionNode;
  currentQuestion: Question | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  handleAddQuestion: (parentHierarchy: string[]) => any;
};

const QuestionNumber = ({
  questionNode,
  currentQuestion,
  setQuestion,
  handleAddQuestion
}: QuestionNumberProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div>
      {questionNode.subquestions && (
        <>
          <div
            style={{
              alignItems: 'center',
              columnGap: '4px',
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}
          >
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ padding: '4px' }}
            >
              {isExpanded ? (
                <ExpandMoreRoundedIcon />
              ) : (
                <KeyboardArrowRightRoundedIcon />
              )}
            </IconButton>
            {questionNode.number}
            <IconButton
              style={{ padding: '4px', marginLeft: 'auto' }}
              // onClick={() => handleAddQuestion(parentNumbers)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: isExpanded ? 'auto' : '0px',
              paddingLeft: '20px',
              rowGap: '8px',
              visibility: isExpanded ? 'inherit' : 'hidden'
            }}
          >
            {questionNode.subquestions.map((q) => (
              <QuestionNumber
                key={questionNode.number + q.number}
                questionNode={q}
                setQuestion={setQuestion}
                currentQuestion={currentQuestion}
                handleAddQuestion={handleAddQuestion}
              />
            ))}
          </div>
        </>
      )}
      {questionNode.question && (
        <Button
          onClick={() => setQuestion(questionNode.question)}
          style={{
            textTransform: 'none',
            backgroundColor:
              currentQuestion === questionNode.question ? '#41403E' : '#E8E9EC',
            color:
              currentQuestion === questionNode.question ? 'white' : 'black',
            border: '1px solid black',
            padding: '0px'
          }}
        >
          {questionNode.number}
        </Button>
      )}
    </div>
  );
};

export default QuestionNumber;
