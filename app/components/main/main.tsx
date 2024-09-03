import React from "react";
import styles from "./main.module.scss";
import { auth } from "../../utils/firebaseConfig";
import { RedirectButton } from "../button/RedirectButton";

export const Main: React.FC = () => {
  const user = auth.currentUser;

  return (
    <main className={styles.container}>
      <section className={styles.welcomeSection}>
        <h1>Welcome to REST/GraphiQL Client!</h1>
        <p className={styles.description}>
          This project is developed as part of the RS School React course and
          aims to provide a client interface for interacting with RESTful and
          GraphQL APIs.
        </p>
      </section>

      <section className={styles.aboutSection}>
        <h2>About the Developers</h2>
        <div className={styles.developerList}>
          <div className={styles.developer}>
            <h3>Maxim</h3>
            <ul>
              <li>
                Implemented Sign In/Sign Up functionality with client-side
                validation.
              </li>
              <li>
                Created the History route to restore previous requests for both
                REST and GraphQL clients.
              </li>
              <li>
                Designed the Welcome route logic to manage token expiration and
                user redirection.
              </li>
            </ul>
            <a
              href="https://github.com/maximozaitsev"
              target="_blank"
              className={styles.link}
              rel="noreferrer"
            >
              GitHub Profile
            </a>
          </div>
          <div className={styles.developer}>
            <h3>Pavel</h3>
            <ul>
              <li>
                Developed the GraphiQL client, including query editing and
                response sections.
              </li>
              <li>
                Implemented the documentation explorer for GraphQL requests.
              </li>
              <li>
                Added support for managing headers and variables within the
                GraphQL client.
              </li>
            </ul>
            <a
              href="https://github.com/FavelLooking"
              target="_blank"
              className={styles.link}
              rel="noreferrer"
            >
              GitHub Profile
            </a>
          </div>
          <div className={styles.developer}>
            <h3>Fedor</h3>
            <ul>
              <li>
                Built the RESTful client with full support for query editing and
                method selection.
              </li>
              <li>
                Developed a functional response section for RESTful API
                interactions.
              </li>
              <li>Added base64 encoding support for URL and request bodies.</li>
            </ul>
            <a
              href="https://github.com/farsenyev"
              target="_blank"
              className={styles.link}
              rel="noreferrer"
            >
              GitHub Profile
            </a>
          </div>
        </div>
      </section>

      <section className={styles.courseSection}>
        <h2>About the Course</h2>
        <p>
          This project is part of the{" "}
          <a
            href="https://rs.school/courses/reactjs"
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            RS School React course
          </a>
          , which covers modern React development practices, including routing,
          client-side state management, and API interactions.
        </p>
      </section>

      <section className={styles.buttonsSection}>
        {!user ? (
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
      </section>
    </main>
  );
};
