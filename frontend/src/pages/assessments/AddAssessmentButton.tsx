import AddIcon from '@mui/icons-material/Add';
import styles from './AddAssessmentButton.module.css';

interface ButtonProps {
  handleOpenForm: () => void | ((type: string) => void);
}

export default function AddAssessmentButton({ handleOpenForm }: ButtonProps) {
  return (
    <div className={styles.addButtonContainer}>
      <button className={styles.addButton} onClick={handleOpenForm}>
        <AddIcon
          style={{
            fontSize: 32
          }}
        />
      </button>
    </div>
  );
}
