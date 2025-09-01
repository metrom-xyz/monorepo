"use client";

import { useEffect, type ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { useAccount, useDisconnect } from "wagmi";
import { APTOS } from "@/src/commons/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { isConnected: connectedEvm } = useAccount();
    const { connected: connectedMvm, disconnect: disconnectMvm } = useWallet();
    const { disconnect: disconnectEvm } = useDisconnect();

    // Needed to make sure the unnecessary wallet provider gets disconnected.
    useEffect(() => {
        if (APTOS && connectedEvm) disconnectEvm();
        if (!APTOS && connectedMvm) disconnectMvm();
    }, [connectedEvm, connectedMvm, disconnectMvm, disconnectEvm]);

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
