import {
  Modal,
  Box,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';

type newQuestionProps = {
  open: boolean;
  handleClose: () => void;
  parent: string[];
};

export default function NewQuestion({
  open,
  handleClose,
  parent
}: newQuestionProps) {
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
          width: '600px',
          height: '400px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
      </Box>
    </Modal>
  );
}
