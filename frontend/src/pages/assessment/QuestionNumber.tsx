import { Button, IconButton } from '@mui/material';
import { Question } from '../../types/assessment';
import { useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { QuestionNode } from './AssessmentPage';
import { arrayEquals } from '../../util/arrays';

type QuestionNumberProps = {
  questionNode: QuestionNode;
  currentQuestion: Question | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>;
  handleAddQuestion: (hierarchy: string[]) => any;
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
            {questionNode.number.at(-1)}
            <IconButton
              style={{ padding: '4px', marginLeft: 'auto' }}
              onClick={() => handleAddQuestion(questionNode.number)}
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
                key={q.number.join(',')}
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
            backgroundColor: arrayEquals(
              currentQuestion?.number || [],
              questionNode.number
            )
              ? '#41403E'
              : '#E8E9EC',
            color: arrayEquals(
              currentQuestion?.number || [],
              questionNode.number
            )
              ? 'white'
              : 'black',
            border: '1px solid black',
            padding: '0px'
          }}
        >
          {questionNode.number.at(-1)}
        </Button>
      )}
    </div>
  );
};

export default QuestionNumber;
