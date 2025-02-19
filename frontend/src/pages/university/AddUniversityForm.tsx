import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Modal,
  Fade,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './AddUniversityForm.module.css';
import { AxiosError } from 'axios';
import usePost from '../../hooks/usePost';
import API from '../../util/api';
import { mapGetUniversityData } from '../../mappers/universityMapper';
import {
  PostUniversity,
  University
} from '@shared/types/models/university/university';

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
  const { postData: addUniversity, isLoading: isAddingUniversity } = usePost<
    PostUniversity,
    University
  >(API.postUniversity, mapGetUniversityData);
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
      setError(
        (addedUniversity.response?.data as { error: string }).error ||
          'An error occurred'
      );
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
            <h2 className={styles.headerText}>Add University</h2>
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
            {isAddingUniversity ? (
              <CircularProgress style={{ marginTop: '1rem' }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 3rem',
                  textTransform: 'none',
                  backgroundColor: '#41709b'
                }}
              >
                Add University
              </Button>
            )}
          </form>
        </div>
      </Fade>
    </Modal>
  );
}
