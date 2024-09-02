import React from "react";
import styles from "./history.module.scss";
import { RedirectButton } from "../button/RedirectButton";

export const History: React.FC = () => {
  const hasHistory = localStorage.getItem("requests") !== null;

  return (
    <div className={styles.historyContainer}>
      <h1>History</h1>
      {!hasHistory ? (
        <div className={styles.emptyHistory}>
          <p>You haven&#39;t executed any requests yet.</p>
          <p>It&#39;s empty here. Try those options:</p>
          <div className={styles.links}>
            <RedirectButton text="REST Client" redirectPath="/rest" />
            <RedirectButton text="GraphiQL Client" redirectPath="/graphql" />
          </div>
        </div>
      ) : (
        <p>History of your requests will be displayed here.</p>
      )}
    </div>
  );
};
