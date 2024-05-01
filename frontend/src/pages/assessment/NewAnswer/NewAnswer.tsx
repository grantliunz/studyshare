import { useState } from 'react';
import Editor from '../../../components/Editor/Editor';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import useGet from '../../../hooks/useGet';
import usePost from '../../../hooks/usePost';
import API from '../../../util/api';
import { Answer } from '../../../types/assessment';
import { AxiosError } from 'axios';

type NewAnswerProps = {
  questionId: string;
  onSubmitAnswer?: Function;
};

const NewAnswer = ({
  questionId,
  onSubmitAnswer = () => {}
}: NewAnswerProps) => {
  const [text, setText] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

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

  const handleSubmitAnswer = async (text: string) => {
    const newAnswer: Omit<Answer, '_id'> = {
      text,
      author: users[0]._id,
      rating: {
        upvotes: 0,
        downvotes: 0
      },
      comments: [],
      isAnonymous
    };
    const res = await postAnswer(newAnswer);
    if (res instanceof AxiosError) {
      console.log(res.response?.data.error);
      return;
    }
    setText('');
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
          style={{ width: 'fit-content' }}
        >
          Submit Answer
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
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
