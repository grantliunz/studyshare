import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Backdrop, Fade, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AddUniversityForm.module.css';

interface AddUniversityFormProps {
  open: boolean;
  onAddUniversity: (name: string) => void;
  onClose: () => void;
}

export default function AddUniversityForm({
  open,
  onAddUniversity,
  onClose
}: AddUniversityFormProps) {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a valid university name.');
      return;
    }
    onAddUniversity(name);
    setName(''); // Clear input after submitting
    setError(''); // Clear error message
    onClose(); // Close the form
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(''); // Clear error message on input change
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-university-modal"
      aria-describedby="add-university-modal-description"
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>Add University</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label="University Name"
              variant="outlined"
              value={name}
              onChange={handleChange}
              required
              fullWidth
              className={styles.inputField}
              error={!!error}
              helperText={error}
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
