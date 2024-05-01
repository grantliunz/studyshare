import { Button, IconButton } from '@mui/material';
import { useState } from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { QuestionNode } from './AssessmentPage';
import { arrayEquals } from '../../util/arrays';
import { QuestionGET } from '../../types/assessment';

type QuestionNumberProps = {
  questionNode: QuestionNode;
  currentQuestion: QuestionGET | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionGET | undefined>>;
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
      {
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
                      padding: '0px',
                      textTransform: 'none'
                    }
                  : {
                      textTransform: 'none',
                      minWidth: '30px',
                      padding: '0px',
                      pointerEvents: 'none'
                    }
              }
            >
              {questionNode.number.at(-1)}
            </Button>
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
        </>
      }
    </div>
  );
};

export default QuestionNumber;
