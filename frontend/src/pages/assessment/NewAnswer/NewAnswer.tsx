import { useState } from 'react';
import Editor from '../../../components/Editor/Editor';
import { Button } from '@mui/material';

type NewAnswerProps = {
  handleSubmitAnswer: (answer: string) => any;
};

const NewAnswer = ({ handleSubmitAnswer }: NewAnswerProps) => {
  const [answer, setAnswer] = useState<string>('');

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <p style={{ margin: '0px', fontWeight: '500', fontSize: '1.3rem' }}>
        Your Answer
      </p>
      <Editor value={answer} setValue={setAnswer} />
      <Button
        variant="contained"
        onClick={() => handleSubmitAnswer(answer)}
        style={{ marginTop: '12px', width: 'fit-content' }}
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default NewAnswer;
