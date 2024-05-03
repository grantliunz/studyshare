
import styles from './Login.module.css';
import LoginCard from '../../components/LoginCard/LoginCard';

export default function Login() {

  return (
    <div className={styles.container}>
      <div className="grid" />
      <LoginCard />
    </div>
  );
}
