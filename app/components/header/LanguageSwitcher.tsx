// app/components/header/LanguageSwitcher.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button className={styles.languageButton} onClick={toggleLanguage}>
      {i18n.language === "en" ? "Рус" : "En"}
    </button>
  );
};
