import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TabButtons from "./TabButtons";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./auth.module.scss";

const AuthContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.authContainer}>
      <TabButtons activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthContainer;
