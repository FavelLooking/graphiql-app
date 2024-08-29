import React from "react";
import styles from "./auth.module.scss";

const LoginForm: React.FC = () => {
  return (
    <form>
      <h2>Login</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input id="password" type="password" name="password" required />
      </div>
      <button type="submit" className={styles.submitButton}>
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
