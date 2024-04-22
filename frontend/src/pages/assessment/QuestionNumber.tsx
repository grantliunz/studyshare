import { Button, IconButton } from '@mui/material';
import { Question, QuestionWithFullNumber } from './Assessment';
import { useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import React from 'react';

type QuestionNumberProps = {
  question: Question;
  currentQuestion: QuestionWithFullNumber | undefined;
  parentNumber: string;
  setQuestion: React.Dispatch<
    React.SetStateAction<QuestionWithFullNumber | undefined>
  >;
};

const QuestionNumber = ({
  question,
  currentQuestion,
  parentNumber,
  setQuestion
}: QuestionNumberProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div>
      {question.subquestions && (
        <div>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              paddingRight: '20px'
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
          </div>
          <div
            style={{
              height: isExpanded ? 'auto' : '0px',
              paddingLeft: '20px',
              visibility: isExpanded ? 'inherit' : 'hidden'
            }}
          >
            {question.subquestions.map((q) => (
              <QuestionNumber
                key={parentNumber + q.number}
                question={q}
                parentNumber={parentNumber + q.number}
                setQuestion={setQuestion}
                currentQuestion={currentQuestion}
              />
            ))}
          </div>
        </div>
      )}
      {question.content && (
        <Button
          onClick={() =>
            setQuestion({
              question,
              fullNumber: parentNumber
            })
          }
          style={{
            textTransform: 'none',
            backgroundColor:
              currentQuestion?.question === question ? '#41403E' : '#E8E9EC',
            color: currentQuestion?.question === question ? 'white' : 'black'
          }}
        >
          {question.number}
        </Button>
      )}
    </div>
  );
};

export default QuestionNumber;
