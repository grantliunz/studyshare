import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import styles from '../course/AddCourseForm.module.css';
import CloseIcon from '@mui/icons-material/Close';
import usePost from '../../hooks/usePost';
import { Course, PostCourse } from '../../types/types';
import API from '../../util/api';
import { mapGetCourseData } from '../../mappers/courseMapper';
import { AxiosError } from 'axios';

interface AddCourseFormProps {
  open: boolean;
  onClose: () => void;
  universityId: string;
  refreshCourses: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  open,
  onClose,
  universityId,
  refreshCourses
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    postData: addCourse,
    isLoading: isAddingCourse,
    error: addCourseError
  } = usePost<PostCourse, Course>(
    `${API.postCourse}/${universityId}`,
    mapGetCourseData
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseName.trim() || !courseCode.trim()) {
      setError('Please enter a valid course name and code.');
      return;
    }

    const newCourseData: PostCourse = {
      code: courseCode,
      name: courseName
    };

    const addedCourse = await addCourse(newCourseData);
    if (addedCourse instanceof AxiosError) {
      setError(addedCourse.response?.data.error || 'An error occurred');
      return;
    }
    setCourseName(''); // Clear inputs after submitting
    setCourseCode('');
    refreshCourses();
    onClose(); // Close the form
  };

  const handleCourseNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseName(event.target.value);
    setError(null); // Clear error when changing input
  };

  const handleCourseCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseCode(event.target.value);
    setError(null); // Clear error when changing input
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-course-modal"
      aria-describedby="add-course-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>Add Course</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <TextField
                label="Course Code"
                variant="outlined"
                value={courseCode}
                onChange={handleCourseCodeChange}
                required
                fullWidth
                style={{ marginBottom: '1rem' }}
              />
            </div>
            <div>
              <TextField
                label="Course Name"
                variant="outlined"
                value={courseName}
                onChange={handleCourseNameChange}
                required
                fullWidth
                className={styles.inputField}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {isAddingCourse ? (
              <CircularProgress style={{ marginTop: '1rem' }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem', padding: '0.5rem 3rem' }}
              >
                Add Course
              </Button>
            )}
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddCourseForm;
