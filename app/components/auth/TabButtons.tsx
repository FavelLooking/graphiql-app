import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./auth.module.scss";

interface TabButtonsProps {
  activeTab: string;
  onTabChange: (tab: "login" | "register") => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTabChange = (tab: "login" | "register") => {
    onTabChange(tab);
    navigate(`/auth?tab=${tab}`);
  };

  return (
    <div className={styles.tabButtons}>
      <button
        onClick={() => handleTabChange("login")}
        className={`${styles.tabButton} ${activeTab === "login" ? styles.active : ""}`}
      >
        {t("buttons.login")}
      </button>
      <button
        onClick={() => handleTabChange("register")}
        className={`${styles.tabButton} ${activeTab === "register" ? styles.active : ""}`}
      >
        {t("buttons.register")}
      </button>
    </div>
  );
};

export default TabButtons;
