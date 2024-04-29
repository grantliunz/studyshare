import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import useGet from '../../hooks/useGet';
import usePost from '../../hooks/usePost';
import {
  mapGetUniversitiesData,
  mapGetUniversityData
} from '../../mappers/universityMapper';
import styles from './University.module.css';
import UniversityCard from './UniversityCard';
import AddButton from '../../components/AddButton/AddButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { University, PostUniversity } from '../../types/types';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddUniversityForm from './AddUniversityForm';
import API from '../../util/api';

export default function University() {
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
    refresh: refreshUniversities
  } = useGet<University[]>(API.getUniversities, [], mapGetUniversitiesData);

  const {
    postData: addUniversity,
    isLoading: isAddingUniversity,
    error: addUniversityError
  } = usePost<PostUniversity, University>(
    '/university/createUniversity',
    mapGetUniversityData
  );

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

  const handleAddUniversity = async (name: string) => {
    if (!name.trim()) {
      return;
    }

    const newUniversityData: PostUniversity = { name };
    const addedUniversity = await addUniversity(newUniversityData);

    if (addedUniversity) {
      setShowForm(false);
      refreshUniversities();
    }
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

  const onQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>University Page</h1>
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
        {displayedData?.length === 0 && !isLoadingUniversities && (
          <p>No universities found</p>
        )}
      </div>
      <AddUniversityForm
        open={showForm}
        onAddUniversity={handleAddUniversity}
        onClose={handleCloseForm}
      />
      {isAddingUniversity && <CircularProgress />}
      <AddButton handleOpenForm={handleOpenForm} />
      {user && <Button onClick={signOut}>Logout (temporary)</Button>}
    </div>
  );
}
