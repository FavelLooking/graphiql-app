import React, {useEffect } from "react";
import {Link} from "react-router-dom";
import styles from './header.module.scss'
//TODO: remove style.css
import '../../style.css'

export const Header: React.FC = () => {

    //TODO: fix getById
    useEffect(() => {
        const handleScroll = () => {
            const navArea = document.getElementById('headerArea');
            if (navArea) {
                if (window.pageYOffset > 0) {
                    navArea.classList.add('is-sticky');
                } else {
                    navArea.classList.remove('is-sticky');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header id={'headerArea'}>
                <div className={styles.logo}>
                    <img className={styles.img_logo} src="/logo.jpg" alt="logo"/>
                </div>
                <div className={styles.toggle}>
                    <input type="checkbox" id="temp"/>
                    <label htmlFor="temp">Language Switch</label>
                </div>
                <div className={styles.auth}>
                    <button>Sign In</button>
                    <button>Sign Up</button>
                </div>
                <div className={styles.link}>
                    {//TODO: add link to main page
                    }
                    <Link to=''>Main Page</Link>
                </div>
            </header>
        </>
    )
}