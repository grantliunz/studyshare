import React, { useState } from 'react';
import useGet from '../../hooks/useGet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';

import mapUniversityData from '../../mappers/universityMapper'; // Import the mapper
import styles from './University.module.css';
import UniversityCard from './UniversityCard';
import AddUniversityForm from './AddUniversityForm';
import AddButton from '../../components/AddButton/AddButton';
import Button from '@mui/material/Button';
import type { University } from '../../types/types';

export default function University() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: universitiesData,
    isLoading,
    refresh
  } = useGet<University[]>(
    '/university/getAllUniversities',
    [],
    mapUniversityData
  );

  const [showForm, setShowForm] = useState(false);

  const handleAddUniversity = (name: string) => {
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
      <div className={styles.universitiesGrid}>
        {universitiesData &&
          !isLoading &&
          universitiesData.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
      </div>
      <AddUniversityForm
        open={showForm}
        onAddUniversity={handleAddUniversity}
        onClose={handleCloseForm}
      />
      <AddButton handleOpenForm={handleOpenForm} />
      <Button onClick={refresh}>Refresh</Button>
      {user && <Button onClick={signOut}>Logout (temporary)</Button>}
    </div>
  );
}
