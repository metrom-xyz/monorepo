"use client";

import { useEffect, type ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { useDisconnect } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useChainType } from "@/src/hooks/useChainType";
import { useWalletConnection } from "@solana/react-hooks";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const chainType = useChainType();
    const { disconnect: disconnectMvm } = useWallet();
    const { disconnect: disconnectEvm } = useDisconnect();
    const { disconnect: disconnectSvm } = useWalletConnection();

    const prevChainType = usePrevious(chainType);

    // Disconnect from the previous chain when the chain type changes to prevent issues with stale connections
    useEffect(() => {
        if (prevChainType === chainType) return;

        disconnectEvm();
        disconnectMvm();
        disconnectSvm();
    }, [prevChainType, chainType, disconnectEvm, disconnectMvm, disconnectSvm]);

    return (
        <div className={styles.layout}>
            <div className={styles.content}>
                <Nav />
                <div className={styles.main}>{children}</div>
            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
}
