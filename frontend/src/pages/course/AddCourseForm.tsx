import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Backdrop, Fade, TextField, Button } from '@mui/material';
import styles from '../university/AddUniversityForm.module.css';
import CloseIcon from '@mui/icons-material/Close';

interface AddCourseFormProps {
  open: boolean;
  onAddCourse: (courseName: string, courseCode: string) => void;
  onClose: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  open,
  onAddCourse,
  onClose
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseName || !courseCode) return;
    onAddCourse(courseName, courseCode);
    setCourseName(''); // Clear inputs after submitting
    setCourseCode('');
    onClose(); // Close the form
  };

  const handleCourseNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseName(event.target.value);
  };

  const handleCourseCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseCode(event.target.value);
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
                className={styles.inputField}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem', padding: '0.5rem 3rem' }}
            >
              Add Course
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddCourseForm;
