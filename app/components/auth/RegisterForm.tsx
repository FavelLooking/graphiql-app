import React from "react";
import styles from "./auth.module.scss";

const RegisterForm: React.FC = () => {
  return (
    <form>
      <h2>Registration</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input id="password" type="password" name="password" required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;
