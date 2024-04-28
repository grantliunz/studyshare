import { Modal, Box, IconButton, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './NewQuestion.module.css';
import Editor from '../../../components/Editor/Editor';
import { useState } from 'react';

type newQuestionProps = {
  open: boolean;
  handleClose: () => void;
  parent: string[];
  defaultQuestionNumber: string;
};

export default function NewQuestion({
  open,
  handleClose,
  parent,
  defaultQuestionNumber
}: newQuestionProps) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    console.log(value);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          height: '800px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          boxSizing: 'border-box'
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
              marginTop: '0',
              fontSize: '1.5rem'
            }}
          >
            New Question
          </h1>
          <IconButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              margin: '10px'
            }}
          >
            <ClearIcon />
          </IconButton>
        </div>
        <div style={{ display: 'flex' }}>
          <p>Question Number: &nbsp;</p>
          <p>{parent.length == 0 ? '' : parent.join('.') + '.'}</p>
          <input
            className={styles.questionNumberInput}
            defaultValue={defaultQuestionNumber}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%'
          }}
        >
          <Editor value={value} setValue={setValue} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{
              width: 'fit-content'
            }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
