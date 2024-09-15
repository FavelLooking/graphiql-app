import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { RedirectButton } from "../button/RedirectButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearToken } from "../../store/authSlice";
import { auth } from "../../utils/firebaseConfig";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector((state: RootState) => state.auth.token);

  const handleSignOut = async () => {
    await auth.signOut();
    dispatch(clearToken());
    navigate("/");
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
    <header ref={headerRef} className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img className={styles.img_logo} src="/logo.jpg" alt="logo" />
        </Link>
      </div>
      <LanguageSwitcher />
      <div className={styles.auth}>
        {!token ? (
          <>
            <RedirectButton
              text={t("buttons.signIn")}
              redirectPath="/auth?tab=login"
            />
            <RedirectButton
              text={t("buttons.signUp")}
              redirectPath="/auth?tab=register"
            />
          </>
        ) : (
          <>
            <RedirectButton
              text={t("buttons.signOut")}
              onClick={handleSignOut}
            />
            <Link className={styles.mainButton} to="/">
              {t("buttons.mainButton")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
