"use client";

import type { ReactNode } from "react";
import { Nav } from "./nav";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className={styles.layout}>
            <Nav />
            <div className={styles.main}>{children}</div>
            {/* TODO: add footer */}
            {/* <div className={styles.footer}>
                <Footer />
            </div> */}
        </div>
    );
}
