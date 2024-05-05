import { useState, FormEvent } from 'react';
import {
  Modal,
  Fade,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AddAssessmentForm.module.css';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';

type AddAssessmentFormProps = {
  state: AssessmentType;
  show: boolean;
  onAddAssessment: (
    formInputs: FormInputs,
    type: AssessmentType
  ) => Promise<string | undefined>;
  onClose: () => void;
};

export type FormInputs = {
  number?: number;
  year: number;
  semester: SemesterType;
  name?: string;
};

type FormInputErrors = {
  number: string;
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
    year: 2024,
    semester: SemesterType.FIRST
  });
  const [currentInputErrors, setCurrentInputErrors] = useState<FormInputErrors>(
    {
      number: '',
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
      year: 2024,
      semester: SemesterType.FIRST
    });
  }

  function clearErrors() {
    setCurrentInputErrors({
      number: '',
      year: '',
      semester: '',
      name: ''
    });
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentInput.year) return;
    if (
      currentInput.year < 1980 ||
      currentInput.year > new Date().getFullYear()
    ) {
      // test for a bad year
      updateError('year', 'Please enter a valid Year.');
      return;
    }
    // Change these to enums?
    if (
      state !== 'Other' &&
      state !== 'Exam' &&
      (!currentInput.number || currentInput.number <= 0)
    ) {
      // // test for a bad assessment number
      updateError(
        'assessmentNumber',
        'Please enter a valid assessment number.'
      );
      return;
    }

    if (
      state === 'Other' &&
      (!currentInput.name || !currentInput.name.trim())
    ) {
      // test for a bad name
      updateError('name', 'Please enter a valid name.');
      return;
    }
    if (state === 'Other') {
      currentInput.semester = SemesterType.OTHER;
    }
    const error = await onAddAssessment(currentInput, state); //returns the current input fields and the type of assessment (exam, test, other)
    if (error) {
      updateError(state !== 'Other' ? 'semester' : 'name', error);
      return;
    }
    clearInputs(); // Clear input after submitting
    clearErrors(); // Clear error message after submitting
    onClose(); // Close the form
  };

  return (
    <Modal
      open={show}
      onClose={() => {
        clearInputs();
        clearErrors();
        onClose();
      }}
      aria-labelledby="add-Assessment-modal"
      aria-describedby="add-Assessment-modal-description"
      closeAfterTransition
    >
      <Fade in={show}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.headerText}>
              Add {state + (state === 'Other' ? ' Assessment' : '')}
            </h2>
            <button
              className={styles.closeButton}
              onClick={() => {
                clearInputs();
                clearErrors();
                onClose();
              }}
            >
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

            {!(state === 'Other' || state === 'Exam') && (
              <TextField
                style={{ marginBottom: '10px' }}
                label="Assessment Number"
                variant="outlined"
                onChange={(e) => updateInput('number', e.target.value)}
                type="number"
                required
                fullWidth
                className={styles.inputField}
                helperText={currentInputErrors.number}
              />
            )}

            {!(state === 'Other') && (
              <FormControl fullWidth>
                <InputLabel id="select-semester-label">Semester</InputLabel>
                <Select
                  labelId="select-semester-label"
                  id="asdasd"
                  value={currentInput.semester}
                  onChange={(e) => updateInput('semester', e.target.value)}
                  required
                  className={styles.inputField}
                  label="Semester"
                >
                  <MenuItem value="First">First</MenuItem>
                  <MenuItem value="Second">Second</MenuItem>
                  <MenuItem value="Third">Third</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <FormHelperText>{currentInputErrors.semester}</FormHelperText>
              </FormControl>
            )}

            {state === 'Other' && (
              <TextField
                label="Name"
                variant="outlined"
                onChange={(e) => updateInput('name', e.target.value)}
                required
                fullWidth
                className={styles.inputField}
                helperText={currentInputErrors.name}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginTop: '1rem',
                padding: '0.5rem 3rem',
                textTransform: 'none',
                backgroundColor: '#41709b'
              }}
            >
              Add
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
}
