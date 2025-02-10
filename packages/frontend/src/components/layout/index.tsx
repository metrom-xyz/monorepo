"use client";

import type { ReactNode } from "react";
import classNames from "classnames";
import { Nav } from "./nav";
import { Footer } from "./footer";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className={styles.root}>
            <div className={classNames(styles.root, styles.layout)}>
                <Nav />
                <div className={styles.main}>{children}</div>
                <Footer />
            </div>
        </div>
    );
}
