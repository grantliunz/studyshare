import { Modal, Box, IconButton, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './NewQuestion.module.css';
import Editor from '../../../components/Editor/Editor';
import { useState } from 'react';
import usePost from '../../../hooks/usePost';
import { Question } from '../../../types/assessment';
import API from '../../../util/api';
import { useParams } from 'react-router-dom';
import useGet from '../../../hooks/useGet';
import { AxiosError } from 'axios';
import { useAuth } from '../../../contexts/UserContext';

type newQuestionProps = {
  open: boolean;
  handleClose: () => void;
  parentNumber: string[];
  onAddQuestion?: Function;
};

export default function NewQuestion({
  open,
  handleClose,
  parentNumber,
  onAddQuestion = () => {}
}: newQuestionProps) {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [questionContent, setQuestionContent] = useState('');
  const [questionNumber, setQuestionNumber] = useState<string>('');
  const [createQuestionError, setCreateQuestionError] = useState<string>(' ');

  const { data: users } = useGet<any>(`${API.getAllUsers}`); // temp to add an author to new question

  const {
    postData: createQuestion,
    isLoading: isCreatingQuestion,
    error: createQuestionBackendError
  } = usePost<Omit<Question, 'assessment' | '_id'>, Question>(
    `${API.createQuestion}/${id}`
  );

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('You must be logged in to make a comment!');
      return;
    }

    if (questionNumber.trim() === '') {
      setCreateQuestionError('Please enter a question number!');
      return;
    }

    const newQuestion = {
      number: [...parentNumber, ...questionNumber.split('.')],
      text: questionContent,
      author: users[0]._id,
      answers: [],
      watchers: [],
      comments: []
    };

    const res = await createQuestion(newQuestion);
    if (res instanceof AxiosError) {
      setCreateQuestionError((res.response?.data as { error: string }).error);
      return;
    }
    setCreateQuestionError(' ');
    onAddQuestion();
  };

  const handleCloseModal = () => {
    setCreateQuestionError(' ');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        placeItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        style={{
          alignItems: 'start',
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '80%',
          padding: '20px',
          width: '80%'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <h1
            style={{
              margin: '0',
              fontSize: '1.5rem'
            }}
          >
            New Question
          </h1>
          <IconButton
            onClick={handleCloseModal}
            style={{
              position: 'relative',
              top: '0',
              right: '0',
              height: 'fit-content'
            }}
          >
            <ClearIcon />
          </IconButton>
        </div>
        <p
          style={{
            alignSelf: 'center',
            color: 'red',
            margin: '0px',
            whiteSpace: 'pre'
          }}
        >
          {createQuestionError}
        </p>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <p>Question Number: &nbsp;</p>
          <p>{parentNumber.length == 0 ? '' : parentNumber.join('.') + '.'}</p>
          <input
            style={{ width: '80px' }}
            className={styles.questionNumberInput}
            onChange={(event) => setQuestionNumber(event.target.value)}
          />
          <p style={{ marginLeft: '2  %' }}>
            (Enter the question with a '.' to denote subquestions, e.g. 1aii
            would be entered as 1.a.ii)
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '350px',
            marginBottom: '10px',
            width: '100%'
          }}
        >
          <Editor value={questionContent} setValue={setQuestionContent} />
        </div>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{
            width: 'fit-content'
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
}
