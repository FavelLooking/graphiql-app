import { LoginButton, RegisterButton } from "~/components/header/header";
import styles from "./main.module.scss";

export const Main: React.FC = () => {
  return (
    <>
      <h1>Welcome to REST/GraphiQL Client!</h1>
      <div className={styles.buttons_container}>
        <LoginButton />
        <RegisterButton />
      </div>
    </>
  );
};
