import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const SignupChoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Join House Hunting</h1>
        <p className={styles.subtitle}>Choose your account type</p>

        <div className={styles.choiceGrid}>
          <button
            className={styles.choiceCard}
            onClick={() => navigate('/signup/tenant')}
          >
            <div className={styles.choiceIcon}>🏠</div>
            <h2>Looking for a House?</h2>
            <p>Sign up as a tenant to search and find your next home</p>
          </button>

          <button
            className={styles.choiceCard}
            onClick={() => navigate('/signup/landlord')}
          >
            <div className={styles.choiceIcon}>🏢</div>
            <h2>Renting Out?</h2>
            <p>Sign up as a landlord to list your properties</p>
          </button>
        </div>

        <div className={styles.divider}>or</div>

        <p className={styles.loginLink}>
          Already have an account?{' '}
          <button
            className={styles.textButton}
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupChoice;
