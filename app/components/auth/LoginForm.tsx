import React, { useState } from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import styles from "./auth.module.scss";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { errors, isFormValid, isTouched, handleBlur } = useFormValidation(
    email,
    password
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // TODO: Login user
      console.log("Logged in");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          required
        />
        {isTouched.email && errors.email && (
          <span className={styles.error}>{errors.email}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          required
        />
        {isTouched.password && errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>
      <button
        type="submit"
        className={`${styles.submitButton} ${
          !isFormValid ? styles.submitButtonDisabled : ""
        }`}
        disabled={!isFormValid}
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
