import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import useGet from '../../hooks/useGet';
import { mapGetUniversitiesData } from '../../mappers/universityMapper';
import styles from './University.module.css';
import UniversityCard from './UniversityCard';
import AddButton from '../../components/AddButton/AddButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddUniversityForm from './AddUniversityForm';
import API from '../../util/api';
import { University } from '@shared/types/models/university/university';

export default function UniversitiesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [displayedData, setDisplayedData] = useState<
    University[] | null | undefined
  >(null);

  const {
    data: universitiesData,
    isLoading: isLoadingUniversities,
    refresh: refreshUniversities,
    error: errorString = null
  } = useGet<University[]>(API.getUniversities, [], mapGetUniversitiesData);

  useEffect(() => {
    if (!query.trim()) {
      setDisplayedData(universitiesData);
    } else {
      const filtered = universitiesData?.filter((university) =>
        university.name.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedData(filtered);
    }
  }, [query, universitiesData]);

  const handleOpenForm = () => {
    if (!user) {
      alert('You must be logged in to make an assessment!');
      return;
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const signOut = () => {
    logout();
    navigate('/');
  };

  const onQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div className={styles.container}>
      {errorString ? (
        <div>{errorString}</div>
      ) : (
        <>
          <h1 className={styles.title}>Universities</h1>
          <SearchBar
            title={'Search for a university'}
            onQueryChange={onQueryChange}
          />
          <div className={styles.universitiesGrid}>
            {isLoadingUniversities && <CircularProgress />}
            {displayedData &&
              displayedData.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            {!isLoadingUniversities &&
              displayedData?.length === 0 &&
              !errorString && <p>No universities found</p>}
          </div>
          <AddUniversityForm
            open={showForm}
            onClose={handleCloseForm}
            refreshUniversities={refreshUniversities}
          />
          <AddButton handleOpenForm={handleOpenForm} />
          {user && <Button onClick={signOut}>Logout (temporary)</Button>}
        </>
      )}
    </div>
  );
}
