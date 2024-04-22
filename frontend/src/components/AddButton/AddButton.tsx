import AddIcon from '@mui/icons-material/Add';
import styles from './AddButton.module.css'; // Assuming you have a CSS module for styles

interface AddButtonProps {
  handleOpenForm: () => void;
}

export default function AddButton({ handleOpenForm }: AddButtonProps) {
  return (
    <div className={styles.addButtonContainer}>
      <button className={styles.addButton} onClick={handleOpenForm}>
        <AddIcon />
      </button>
    </div>
  );
}
