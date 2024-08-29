import React from "react";
import styles from "./auth.module.scss";

interface TabButtonsProps {
  activeTab: string;
  onTabChange: (tab: "login" | "register") => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabButtons}>
      <button
        onClick={() => onTabChange("login")}
        className={`${styles.tabButton} ${activeTab === "login" ? styles.active : ""}`}
      >
        Login
      </button>
      <button
        onClick={() => onTabChange("register")}
        className={`${styles.tabButton} ${activeTab === "register" ? styles.active : ""}`}
      >
        Registration
      </button>
    </div>
  );
};

export default TabButtons;
