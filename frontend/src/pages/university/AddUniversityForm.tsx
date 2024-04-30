import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AddUniversityForm.module.css';
import { PostUniversity, University } from '../../types/types';
import { AxiosError } from 'axios';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import { mapGetUniversityData } from '../../mappers/universityMapper';

interface AddUniversityFormProps {
  open: boolean;
  onClose: () => void;
  refreshUniversities: () => void;
}

export default function AddUniversityForm({
  open,
  onClose,
  refreshUniversities
}: AddUniversityFormProps) {
  const [name, setName] = useState<string>('');
  const {
    postData: addUniversity,
    isLoading: isAddingUniversity,
    error: addUniversityError
  } = usePost<PostUniversity, University>(
    API.postUniversity,
    mapGetUniversityData
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a valid university name.');
      return;
    }

    const newUniversityData: PostUniversity = { name };
    const addedUniversity = await addUniversity(newUniversityData);
    if (addedUniversity instanceof AxiosError) {
      setError(addedUniversity.response?.data.error || 'An error occurred');
      return addedUniversity;
    }

    setName(''); // Clear input after submitting
    setError(''); // Clear error message
    refreshUniversities();
    onClose();
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
            {isAddingUniversity && <CircularProgress />}

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
