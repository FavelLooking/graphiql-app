import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.pageYOffset > 0) {
          headerRef.current.classList.add(styles.isSticky);
        } else {
          headerRef.current.classList.remove(styles.isSticky);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img className={styles.img_logo} src="/logo.jpg" alt="logo" />
          </Link>
        </div>
        <div className={styles.toggle}>
          <input type="checkbox" id="temp" />
          <label htmlFor="temp">Language Switch</label>
        </div>
        <div className={styles.auth}>
          <LoginButton />
          <RegisterButton />
        </div>
      </header>
    </>
  );
};

export const LoginButton: React.FC = () => {
  return (
    <Link to="/auth?tab=login">
      <button>Sign In</button>
    </Link>
  );
};

export const RegisterButton: React.FC = () => {
  return (
    <Link to="/auth?tab=register">
      <button>Sign Up</button>
    </Link>
  );
};
