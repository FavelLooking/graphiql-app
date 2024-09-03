import React from "react";
import styles from "./main.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { RedirectButton } from "../button/RedirectButton";

export const Main: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <>
      <h1>Welcome to REST/GraphiQL Client!</h1>
      <div className={styles.buttons_container}>
        {!token ? (
          <>
            <RedirectButton text="Sign In" redirectPath="/auth?tab=login" />
            <RedirectButton text="Sign Up" redirectPath="/auth?tab=register" />
          </>
        ) : (
          <>
            <RedirectButton text="REST Client" redirectPath="/rest" />
            <RedirectButton text="GraphiQL" redirectPath="/graphql" />
            <RedirectButton text="History" redirectPath="/history" />
          </>
        )}
      </div>
    </>
  );
};
