import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AddAssessmentForm.module.css';
import { AssessmentType } from '../../types/assessment';

interface AddAssessmentFormProps {
  state: AssessmentType;
  show: boolean;
  onAddAssessment: (formInputs: FormInputs, type: AssessmentType) => void;
  onClose: () => void;
}

export type FormInputs = {
  assessmentNumber: number;
  year: number;
  semester: string;
  name: string;
};

type FormInputErrors = {
  assessmentNumber: string;
  year: string;
  semester: string;
  name: string;
};

export default function AddAssessmentForm({
  state,
  show,
  onAddAssessment,
  onClose
}: AddAssessmentFormProps) {
  const [currentInput, setCurrentInput] = useState<FormInputs>({
    assessmentNumber: 0,
    year: 2024,
    semester: '',
    name: ''
  });
  const [currentInputErrors, setCurrentInputErrors] = useState<FormInputErrors>(
    {
      assessmentNumber: '',
      year: '',
      semester: '',
      name: ''
    }
  );

  function updateInput(parameter: string, newValue: string) {
    setCurrentInput({
      ...currentInput,
      [parameter]: newValue
    });
  }

  function updateError(parameter: string, errorMessage: string) {
    setCurrentInputErrors({
      ...currentInputErrors,
      [parameter]: errorMessage
    });
  }

  function clearInputs() {
    setCurrentInput({
      assessmentNumber: 0,
      year: 2024,
      semester: '',
      name: ''
    });
  }

  function clearErrors() {
    setCurrentInputErrors({
      assessmentNumber: '',
      year: '',
      semester: '',
      name: ''
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentInput.year < 1980 || currentInput.year > 2024) {
      // test for a bad year
      updateError('year', 'Please enter a valid Year.');
      return;
    }

    if (
      currentInput.assessmentNumber <= 0 &&
      state !== 'Other' &&
      state !== 'Exam'
    ) {
      // // test for a bad assessment number
      updateError(
        'assessmentNumber',
        'Please enter a valid assessment number.'
      );
      return;
    }

    if (state === 'Other' && !currentInput.name.trim()) {
      // test for a bad name
      // TODO: Check if the name is already used in the database (optional, can just assume noone tries to make the same assessment twice)
      updateError('name', 'Please enter a valid name.');
      return;
    }
    onAddAssessment(currentInput, state); //returns the current input fields and the type of assessment (exam, test, other)
    clearInputs(); // Clear input after submitting
    clearErrors(); // Clear error message after submitting
    onClose(); // Close the form
  };

  return (
    <Modal
      open={show}
      onClose={() => {
        clearInputs();
        onClose();
      }}
      aria-labelledby="add-Assessment-modal"
      aria-describedby="add-Assessment-modal-description"
      closeAfterTransition
    >
      <Fade in={show}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>Add {state + (state === 'Other' ? ' Assessment' : '')}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              style={{ marginBottom: '10px' }}
              label="Year"
              variant="outlined"
              value={currentInput.year}
              onChange={(e) => updateInput('year', e.target.value)}
              type="number"
              required
              fullWidth
              className={styles.inputField}
              helperText={currentInputErrors.year}
            />

            <TextField
              disabled={state === 'Other' || state === 'Exam'}
              style={{ marginBottom: '10px' }}
              label="Assessment Number"
              variant="outlined"
              value={currentInput.assessmentNumber}
              onChange={(e) => updateInput('assessmentNumber', e.target.value)}
              type="number"
              required
              fullWidth
              className={styles.inputField}
              helperText={currentInputErrors.assessmentNumber}
            />

            <FormControl fullWidth disabled={state === 'Other'}>
              <InputLabel id="select-semester-label">Semester</InputLabel>
              <Select
                labelId="select-semester-label"
                id="asdasd"
                value={currentInput.semester}
                onChange={(e) => updateInput('semester', e.target.value)}
                required
                className={styles.inputField}
              >
                <MenuItem value="First">First</MenuItem>
                <MenuItem value="Second">Second</MenuItem>
                <MenuItem value="Third">Third</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Name"
              variant="outlined"
              value={currentInput.name}
              onChange={(e) => updateInput('name', e.target.value)}
              required
              fullWidth
              className={styles.inputField}
              helperText={currentInputErrors.name}
              disabled={state !== 'Other'}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem', padding: '0.5rem 3rem' }}
            >
              Add
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
}
