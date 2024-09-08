import React, { useEffect, useState } from "react";
import styles from "./history.module.scss";
import { RedirectButton } from "../button/RedirectButton";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { Link } from "@remix-run/react";

export const History: React.FC = () => {
  const [links, setLinks] = useState<{ query: string; route: string }[]>([]);
  const items = useSelector((state: RootState) => state.history.queries);

  useEffect(() => {
    setLinks(items);
  }, [items]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className={styles.historyContainer}>
      <h1>History</h1>
      {links.length === 0 ? (
        <div className={styles.emptyHistory}>
          <p>You haven&#39;t executed any requests yet.</p>
          <p>It&#39;s empty here. Try those options:</p>
          <div className={styles.links}>
            <RedirectButton text="REST Client" redirectPath="/rest" />
            <RedirectButton text="GraphiQL Client" redirectPath="/graphql" />
          </div>
        </div>
      ) : (
        <div className={styles.linkContainer}>
          {links.map((link, index) => (
            <Link
              to={`../${link.route}`}
              key={index}
              className={styles.queryLinks}
            >
              <span>{link.query.toUpperCase()}</span>
              <span>{truncateText(link.route, 30)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
