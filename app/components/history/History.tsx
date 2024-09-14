import React, { useEffect, useState } from "react";
import styles from "./history.module.scss";
import { RedirectButton } from "../button/RedirectButton";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { Link, useNavigate } from "@remix-run/react";

import { useTranslation } from "react-i18next";

export const History: React.FC = () => {
  const [links, setLinks] = useState<{ query: string; route: string }[]>([]);
  const items = useSelector((state: RootState) => state.history.queries);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setLinks(items);
  }, [items]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const { t } = useTranslation();
  return (
    <div className={styles.historyContainer}>
      <h1>{t("buttons.history")}</h1>
      {links.length === 0 ? (
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
