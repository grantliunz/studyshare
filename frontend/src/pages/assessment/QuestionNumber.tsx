import { Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { QuestionNode } from './AssessmentPage';
import { arrayEquals } from '../../util/arrays';
import { QuestionLazy } from '@shared/types/models/assessment/assessment';

type QuestionNumberProps = {
  questionNode: QuestionNode;
  currentQuestion: QuestionLazy | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionLazy | undefined>>;
  handleAddQuestion: (hierarchy: string[]) => any;
};

const QuestionNumber = ({
  questionNode,
  currentQuestion,
  setQuestion,
  handleAddQuestion
}: QuestionNumberProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hideText, setHideText] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const width = document.getElementById('questionButton')?.clientWidth;
    if (width && width < 100) {
      setHideText(true);
    } else {
      setHideText(false);
    }
  });

  return (
    <div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          width: '100%'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '3px',
            visibility: questionNode.subquestions ? 'inherit' : 'hidden'
          }}
        >
          {isExpanded ? (
            <ExpandMoreRoundedIcon />
          ) : (
            <KeyboardArrowRightRoundedIcon />
          )}
        </IconButton>
        <Button
          onClick={() =>
            questionNode.question && setQuestion(questionNode.question)
          }
          id="questionButton"
          fullWidth
          sx={{
            '&.MuiButtonBase-root:hover': {
              bgcolor: questionNode.question
                ? arrayEquals(
                    currentQuestion?.number || [],
                    questionNode.number
                  )
                  ? '#41709b'
                  : 'rgba(0, 0, 0, 0.04)'
                : 'transparent'
            },
            '&.MuiButtonBase-root': {
              bgcolor: arrayEquals(
                currentQuestion?.number || [],
                questionNode.number
              )
                ? '#41709b'
                : '#E8E9EC'
            }
          }}
          style={
            questionNode.question
              ? {
                  border: '1px solid black',
                  color: arrayEquals(
                    currentQuestion?.number || [],
                    questionNode.number
                  )
                    ? 'white'
                    : 'black',
                  minWidth: '30px',
                  padding: '0 0 0 10px',
                  textTransform: 'none',
                  display: 'flex',
                  justifyContent: 'start',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }
              : {
                  textTransform: 'none',
                  minWidth: '30px',
                  padding: '0 0 0 0',
                  pointerEvents: 'none',
                  display: 'flex',
                  justifyContent: 'start'
                }
          }
        >
          {questionNode.number.at(-1)}&nbsp;
          <span
            style={{
              opacity: 0.5,
              fontSize: '0.8rem',
              display: hideText ? 'none' : 'inline'
            }}
          >
            {questionNode.question?.text.replace(/<\/?[^>]+(>|$)/g, '').trim()}
          </span>
        </Button>
        <IconButton
          style={{
            padding: '4px',
            margin: '0 10px 0 0',
            visibility: isHovered ? 'inherit' : 'hidden'
          }}
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
          paddingLeft: '12px',
          rowGap: '4px',
          visibility: isExpanded ? 'inherit' : 'hidden'
        }}
      >
        {questionNode.subquestions &&
          questionNode.subquestions.map((q) => (
            <QuestionNumber
              key={q.number.join(',')}
              questionNode={q}
              setQuestion={setQuestion}
              currentQuestion={currentQuestion}
              handleAddQuestion={handleAddQuestion}
            />
          ))}
      </div>
    </div>
  );
};

export default QuestionNumber;
