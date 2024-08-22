import React from "react";
import {Link} from "@remix-run/react";
import styles from './footer.module.scss'

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <Link to={'https://github.com/FavelLooking/graphiql-app'} className={styles.link_GH}>Task GH</Link>
            <h2>2024</h2>
            <Link to={'https://rs.school/react/'} className={styles.link_course}>
                <img src="/rss-logo.svg" alt="course logo"/>
            </Link>
        </footer>
    )
}