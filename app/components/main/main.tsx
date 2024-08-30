import React from "react";
import styles from "./main.module.scss";
import { auth } from "../../utils/firebaseConfig";
import { Link } from "react-router-dom";
import { LoginButton, RegisterButton } from "../header/header";

export const Main: React.FC = () => {
  const user = auth.currentUser;

  return (
    <>
      <h1>Welcome to REST/GraphiQL Client!</h1>
      <div className={styles.buttons_container}>
        {!user ? (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        ) : (
          <>
            <Link to="/rest">
              <button className={styles.auth_button}>REST Client</button>
            </Link>
            <Link to="/graphql">
              <button className={styles.auth_button}>GraphiQL Client</button>
            </Link>
            <Link to="/history">
              <button className={styles.auth_button}>History</button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};
