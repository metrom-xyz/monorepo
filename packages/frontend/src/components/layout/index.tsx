"use client";

import type { ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className={styles.layout}>
            <Nav />
            <div className={styles.main}>{children}</div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
}
