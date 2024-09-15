import React, { useEffect, useState } from "react";
import styles from "./main.module.scss";
import { auth } from "../../utils/firebaseConfig";
import { RedirectButton } from "../button/RedirectButton";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

export const Main: React.FC = () => {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isHydrated || loading) {
    return (
      <>
        <div className={styles.loader}>Loading...</div>
      </>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.welcomeSection}>
        <h1>{t("welcome")}</h1>
        <p className={styles.description}>{t("description")}</p>
      </section>

      <section className={styles.aboutSection}>
        <h2>{t("developers")}</h2>
        <div className={styles.developerList}>
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
          <div className={styles.developer}>
            <h3>{t("pavel")}</h3>
            <ul>
              <li>{t("pavelTasks.task1")}</li>
              <li>{t("pavelTasks.task2")}</li>
              <li>{t("pavelTasks.task3")}</li>
            </ul>
            <a
              href="https://github.com/FavelLooking"
              target="_blank"
              className={styles.link}
              rel="noreferrer"
            >
              {t("github")}
            </a>
          </div>
          <div className={styles.developer}>
            <h3>{t("fedor")}</h3>
            <ul>
              <li>{t("fedorTasks.task1")}</li>
              <li>{t("fedorTasks.task2")}</li>
              <li>{t("fedorTasks.task3")}</li>
            </ul>
            <a
              href="https://github.com/farsenyev"
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
  );
};
