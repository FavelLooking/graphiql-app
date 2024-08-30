import React from "react";
import { Link } from "react-router-dom";

import styles from "./button.module.scss";

interface IRedirectButtonProps {
  text: string;
  onClick?: () => void;
  redirectPath?: string;
}

export const RedirectButton: React.FC<IRedirectButtonProps> = ({
  text,
  onClick,
  redirectPath,
}) => {
  return (
    <Link to={redirectPath || "#"} onClick={onClick}>
      <button className={styles.auth_button}>{text}</button>
    </Link>
  );
};
