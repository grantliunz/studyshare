import { Button, IconButton } from '@mui/material';
import { Question, QuestionWithFullNumber } from './Assessment';
import { useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

type QuestionNumberProps = {
  question: Question;
  currentQuestion: QuestionWithFullNumber | undefined;
  parentNumbers: string[];
  setQuestion: React.Dispatch<
    React.SetStateAction<QuestionWithFullNumber | undefined>
  >;
  handleAddQuestion: (parentHierarchy: string[]) => any;
};

const QuestionNumber = ({
  question,
  currentQuestion,
  parentNumbers,
  setQuestion,
  handleAddQuestion
}: QuestionNumberProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div>
      {question.subquestions && (
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
            {question.number}
            <IconButton
              style={{ padding: '4px', marginLeft: 'auto' }}
              onClick={() => handleAddQuestion(parentNumbers)}
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
            {question.subquestions.map((q) => (
              <QuestionNumber
                key={parentNumbers.join('') + q.number}
                question={q}
                parentNumbers={[...parentNumbers, q.number]}
                setQuestion={setQuestion}
                currentQuestion={currentQuestion}
                handleAddQuestion={handleAddQuestion}
              />
            ))}
          </div>
        </>
      )}
      {question.content && (
        <Button
          onClick={() =>
            setQuestion({
              question,
              hierarchy: parentNumbers
            })
          }
          style={{
            textTransform: 'none',
            backgroundColor:
              currentQuestion?.question === question ? '#41403E' : '#E8E9EC',
            color: currentQuestion?.question === question ? 'white' : 'black',
            border: '1px solid black',
            padding: '0px'
          }}
        >
          {question.number}
        </Button>
      )}
    </div>
  );
};

export default QuestionNumber;
