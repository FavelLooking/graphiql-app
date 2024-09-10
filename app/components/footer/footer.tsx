import React from "react";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import styles from "./footer.module.scss";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <Link
        to={"https://github.com/FavelLooking/graphiql-app"}
        className={styles.link_GH}
      >
        {t("titles.taskGH")}
      </Link>
      <h2>2024</h2>
      <Link
        to={"https://rs.school/"}
        className={styles.link_course}
        target="_blank"
        rel="noreferrer"
      >
        <img src="/rss-logo.svg" alt="course logo" />
      </Link>
    </footer>
  );
};
