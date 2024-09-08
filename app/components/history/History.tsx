import React from "react";
import styles from "./history.module.scss";
import { RedirectButton } from "../button/RedirectButton";
import { useTranslation } from "react-i18next";

export const History: React.FC = () => {
  // TODO: set correct source of history when it's implemented
  const hasHistory = localStorage.getItem("requests") !== null;

  const { t } = useTranslation();
  return (
    <div className={styles.historyContainer}>
      <h1>{t("buttons.history")}</h1>
      {!hasHistory ? (
        <div className={styles.emptyHistory}>
          <p>{t("emptyHistoryP1")}</p>
          <p>{t("emptyHistoryP2")}</p>
          <div className={styles.links}>
            <RedirectButton
              text={t("buttons.restClient")}
              redirectPath="/rest"
            />
            <RedirectButton
              text={t("buttons.graphiqlClient")}
              redirectPath="/graphql"
            />
          </div>
        </div>
      ) : (
        <p>{t("historyDescription")}</p>
      )}
    </div>
  );
};
