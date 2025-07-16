"use client";

import { useEffect, type ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { useAccount, useDisconnect } from "wagmi";
import { APTOS } from "@/src/commons/env";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

    // TODO: needed?
    useEffect(() => {
        if (APTOS && address) disconnect();
    }, [address, disconnect]);

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
