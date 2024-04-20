import React, { useState } from 'react';
import { useAuth } from '../../contexts/UserContext';
import SearchBar from '../../components/SearchBar';
import UniversityCard from './UniversityCard';
import AddUniversityForm from './AddUniversityForm';
import styles from './University.module.css';
import clock from '../../assets/clock.png';
import AddIcon from '@mui/icons-material/Add';

interface University {
  id: number;
  name: string;
  image: string;
}

const universities: University[] = [
  {
    id: 1,
    name: 'University of Toronto',
    image: clock
  },
  {
    id: 2,
    name: 'University of Waterloo',
    image: clock
  }
];

export default function University() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const handleAddUniversity = (name: string) => {
    // Implement adding a new university to your data (e.g., API call)
    console.log('Adding university:', name);
    // For demonstration purposes, let's just log the new name
    const newUniversity: University = {
      id: universities.length + 1,
      name,
      image: clock
    };
    const updatedUniversities = [...universities, newUniversity];
    // Assuming universities is a state variable, update it
    // setUniversities(updatedUniversities);
    setShowForm(false); // Hide the form after adding
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h1>University Page</h1>
      <SearchBar title={'Search for a university'} />
      <div className={styles.universitiesGrid}>
        {universities.map((university) => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>
      <AddUniversityForm
        open={showForm}
        onAddUniversity={handleAddUniversity}
        onClose={handleCloseForm}
      />

      {/* Add Button */}
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={handleOpenForm}>
          <AddIcon />
        </button>
      </div>
    </div>
  );
}
