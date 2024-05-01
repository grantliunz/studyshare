import { useState } from 'react';
import Editor from '../../../components/Editor/Editor';
import { Button } from '@mui/material';
import useGet from '../../../hooks/useGet';
import usePost from '../../../hooks/usePost';
import API from '../../../util/api';
import { Answer } from '../../../types/assessment';
import { AxiosError } from 'axios';

type NewAnswerProps = {
  questionId: string;
  onSubmitAnswer?: () => void;
};

const NewAnswer = ({
  questionId,
  onSubmitAnswer = () => {}
}: NewAnswerProps) => {
  const [answer, setAnswer] = useState<string>('');

  // temp to add an author to new answer
  const {
    data: users,
    isLoading: isFetchingUsers,
    error: fetchUsersError
  } = useGet<any>(`${API.getAllUsers}`);

  const {
    postData: postAnswer,
    isLoading: isPostingAnswer,
    error: postAnswerError
  } = usePost(`${API.createAnswer}/${questionId}`);

  const handleSubmitAnswer = async () => {
    const newAnswer: Omit<Answer, '_id'> = {
      text: answer,
      author: users[0]._id,
      rating: {
        upvotes: 0,
        downvotes: 0
      },
      comments: []
    };
    const res = await postAnswer(newAnswer);
    if (res instanceof AxiosError) {
      console.log(res.response?.data.error);
      return;
    }
    setAnswer('');
    onSubmitAnswer();
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
      <Editor value={answer} setValue={setAnswer} />
      <Button
        variant="contained"
        onClick={handleSubmitAnswer}
        style={{
          marginTop: '12px',
          width: 'fit-content',
          textTransform: 'none',
          backgroundColor: '#41709b'
        }}
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default NewAnswer;
