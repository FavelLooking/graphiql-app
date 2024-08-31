import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { auth } from "../../utils/firebaseConfig";
import { RedirectButton } from "../button/RedirectButton";

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/auth");
  };

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
          {!user ? (
            <>
              <RedirectButton text="Sign In" redirectPath="/auth?tab=login" />
              <RedirectButton text="Sign Up" redirectPath="/auth?tab=register" />
            </>
          ) : (
            <RedirectButton text="Sign Out" onClick={handleSignOut} />
          )}
        </div>
      </header>
    </>
  );
};
