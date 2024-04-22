import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import UniversityCard from './UniversityCard';
import AddUniversityForm from './AddUniversityForm';
import AddButton from '../../components/AddButton/AddButton'; // Import AddButton component
import styles from './University.module.css';
import clock from '../../assets/clock.png';
import Button from '@mui/material/Button';

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
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

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

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>University Page</h1>
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
      <AddButton handleOpenForm={handleOpenForm} />
      {user && <Button onClick={signOut}>Logout (temporary)</Button>}
    </div>
  );
}
