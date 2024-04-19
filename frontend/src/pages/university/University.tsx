import { useAuth } from '../../contexts/UserContext';
import SearchBar from '../../components/SearchBar';
import UniversityCard from './UniversityCard';
import styles from './University.module.css';
import clock from '../../assets/clock.png';

const universities = [
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
  return (
    <div>
      <h1>University Page</h1>
      <SearchBar title={'Search for a university'} />
      <div className={styles.universitiesGrid}>
        {universities.map((university) => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>
    </div>
  );
}
