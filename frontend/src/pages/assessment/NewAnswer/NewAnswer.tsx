import { useState } from 'react';
import Editor from '../../../components/Editor/Editor';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import usePost from '../../../hooks/usePost';
import API from '../../../util/api';
import { AxiosError } from 'axios';
import { useAuth } from '../../../contexts/UserContext';

type NewAnswerProps = {
  questionId: string;
  onSubmitAnswer?: () => void;
};

const NewAnswer = ({
  questionId,
  onSubmitAnswer = () => {}
}: NewAnswerProps) => {
  const [text, setText] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const { user: currentUser, userDb: currentUserDb, refreshUserDb } = useAuth();
  const { postData: postAnswer } = usePost(`${API.createAnswer}/${questionId}`);

  const handleSubmitAnswer = async (text: string) => {
    if (!currentUser || !currentUserDb) {
      alert('You must be logged in to submit an answer!');
      return;
    }
    if (text.replace(/<\/?[^>]+(>|$)/g, '').trim() === '') {
      alert('Please enter an answer!');
      return;
    }
    const res = await postAnswer({
      text,
      author: currentUserDb._id,
      rating: {
        upvotes: 0,
        downvotes: 0
      },
      comments: [],
      isAnonymous,
      question: questionId
    });
    if (res instanceof AxiosError) {
      console.log(res.response?.data.error);
      return;
    }
    setText('');
    onSubmitAnswer();
    refreshUserDb();
  };

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
      <Editor value={text} setValue={setText} />
      <div
        style={{
          alignItems: 'center',
          columnGap: '16px',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '12px'
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleSubmitAnswer(text)}
          style={{
            width: 'fit-content',
            textTransform: 'none',
            backgroundColor: '#41709b'
          }}
        >
          Submit Answer
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) => setIsAnonymous(event.target.checked)}
            />
          }
          label="Send Anonymously"
        />
      </div>
    </div>
  );
};

export default NewAnswer;
