import { Modal, Box, IconButton, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './NewQuestion.module.css';
import Editor from '../../../components/Editor/Editor';
import { useContext, useState } from 'react';
import usePost from '../../../hooks/usePost';
import API from '../../../util/api';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../../../contexts/UserContext';
import {
  CreateQuestionDTO,
  Question
} from '@shared/types/models/question/question';
import { LoginPopupContext } from '../AssessmentPage';

type newQuestionProps = {
  open: boolean;
  handleClose: () => void;
  parentNumber: string[];
  onAddQuestion?: () => void;
};

export default function NewQuestion({
  open,
  handleClose,
  parentNumber,
  onAddQuestion = () => {}
}: newQuestionProps) {
  const { assessmentId } = useParams();
  const { user: currentUser, userDb, refreshUserDb } = useAuth();
  const [questionContent, setQuestionContent] = useState('');
  const [questionNumber, setQuestionNumber] = useState<string>('');
  const [createQuestionError, setCreateQuestionError] = useState<string>(' ');
  const setLoginPopup = useContext(LoginPopupContext);
  const [anonymousQuestion, setAnonymousQuestion] = useState<boolean>(false);

  const { postData: createQuestion } = usePost<CreateQuestionDTO, Question>(
    `${API.createQuestion}/${assessmentId}`
  );

  const handleSubmit = async () => {
    if (questionContent.replace(/<(?!img)[^>]+>/g, '').trim() === '') {
      setCreateQuestionError('Please enter a question!');
      return;
    }
    if (!currentUser || !userDb) {
      setLoginPopup(true);
      return;
    }

    if (questionNumber.trim() === '') {
      setCreateQuestionError('Please enter a question number!');
      return;
    }

    const res = await createQuestion({
      number: [...parentNumber, ...questionNumber.split('.')],
      versions: [
        {
          text: questionContent,
          author: userDb._id,
          createdAt: new Date(),
          isAnonymous: anonymousQuestion
        }
      ],
      reporters: [],
      answers: [],
      comments: [],
      latestContributor: userDb._id
    });
    if (res instanceof AxiosError) {
      setCreateQuestionError((res.response?.data as { error: string }).error);
      return;
    }
    setCreateQuestionError(' ');
    onAddQuestion();
    refreshUserDb();
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
          <p style={{ overflow: 'auto' }}>
            {parentNumber.length == 0 ? '' : parentNumber.join('.') + '.'}
          </p>
          <input
            style={{ width: '40px', paddingTop: '6px' }}
            className={styles.questionNumberInput}
            onChange={(event) => setQuestionNumber(event.target.value)}
          />
        </div>
        <p style={{ fontWeight: '100', fontStyle: 'italic' }}>
          Enter the question with a '.' to denote subquestions, e.g. 1aii would
          be entered as 1.a.ii
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
            height: '80%',
            flexGrow: 1,
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <Editor value={questionContent} setValue={setQuestionContent} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <input
              type="checkbox"
              onChange={(event) => {
                setAnonymousQuestion(event.target.checked);
              }}
            />
            <label htmlFor="anonymousCheckbox" style={{ marginLeft: '4px' }}>
              Anonymous
            </label>
          </div>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{
              textTransform: 'none',
              backgroundColor: '#41709b',
              marginRight: '8px' // Add some margin to separate the button and checkbox
            }}
          >
            Create Question
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
