import React, { useEffect, useState, Suspense } from "react";
import styles from "./main.module.scss";
import { auth } from "../../utils/firebaseConfig";
import { RedirectButton } from "../button/RedirectButton";
import { useTranslation } from "react-i18next"; // Правильное использование useTranslation
import { onAuthStateChanged } from "firebase/auth";

export const Main: React.FC = () => {
  const { t } = useTranslation(); // Получаем функцию t для переводов
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true); // Mark hydration as complete

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      setLoading(false); // Hide loading once user state is updated
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, []);

  if (!isHydrated || loading) {
    return <div className={styles.loader}>Loading...</div>; // Fallback UI during loading or hydration
  }

  return (
    <Suspense fallback={<div>Loading main content...</div>}>
      <main className={styles.container}>
        <section className={styles.welcomeSection}>
          <h1>{t("welcome")}</h1> {/* Используем функцию t для переводов */}
          <p className={styles.description}>{t("description")}</p>
        </section>

        <section className={styles.aboutSection}>
          <h2>{t("developers")}</h2>
          <div className={styles.developerList}>
            {/* Developer info section */}
            <div className={styles.developer}>
              <h3>{t("maxim")}</h3>
              <ul>
                <li>{t("maximTasks.task1")}</li>
                <li>{t("maximTasks.task2")}</li>
                <li>{t("maximTasks.task3")}</li>
              </ul>
              <a
                href="https://github.com/maximozaitsev"
                target="_blank"
                className={styles.link}
                rel="noreferrer"
              >
                {t("github")}
              </a>
            </div>
          </div>
        </section>

        <section className={styles.courseSection}>
          <h2>{t("cource")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("courseInfo") }} />
        </section>

        <section className={styles.buttonsSection}>
          {!user ? (
            <>
              <RedirectButton
                text={t("buttons.signIn")}
                redirectPath="/auth?tab=login"
              />
              <RedirectButton
                text={t("buttons.signUp")}
                redirectPath="/auth?tab=register"
              />
            </>
          ) : (
            <>
              <RedirectButton
                text={t("buttons.restClient")}
                redirectPath="/rest"
              />
              <RedirectButton
                text={t("buttons.graphiqlClient")}
                redirectPath="/graphql"
              />
              <RedirectButton
                text={t("buttons.history")}
                redirectPath="/history"
              />
            </>
          )}
        </section>
      </main>
    </Suspense>
  );
};
