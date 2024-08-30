import React, { useState } from "react";
import { useFormValidation } from "../../utils/useFormValidation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";

import styles from "./auth.module.scss";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { errors, isFormValid, isTouched, handleBlur } = useFormValidation(
    email,
    password,
    confirmPassword
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User registered", userCredential.user);
        navigate("/");
      } catch (error) {
        console.error("Error registering", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registration</h2>
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
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          required
        />
        {isTouched.confirmPassword && errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>
      <button
        type="submit"
        className={`${styles.submitButton} ${
          !isFormValid ? styles.submitButtonDisabled : ""
        }`}
        disabled={!isFormValid}
      >
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;
