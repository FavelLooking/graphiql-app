import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleAuthSubmit } from "../../utils/authHandler";
import styles from "./auth.module.scss";
import Notification from "../notification/Notification";
import { useFormValidation } from "../../utils/useFormValidation";
import { useTranslation } from "react-i18next";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { errors, isFormValid, isTouched, handleBlur } = useFormValidation(
    email,
    password,
    confirmPassword
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const result = await handleAuthSubmit(false, email, password, dispatch);
      setNotification({
        message: result.message,
        type: result.success ? "success" : "error",
      });
      if (result.success) {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <h2>{t("buttons.register")}</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email">{t("titles.email")}:</label>
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
        <label htmlFor="password">{t("titles.password")}:</label>
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
        <label htmlFor="confirmPassword">{t("titles.confirmPassword")}:</label>
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
        {t("buttons.signUp")}
      </button>
    </form>
  );
};

export default RegisterForm;
