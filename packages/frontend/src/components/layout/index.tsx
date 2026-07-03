"use client";

import { useEffect, type ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { useAccount as useAccountEvm, useDisconnect } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useChainType } from "@/src/context/chain-type";
import { useWalletConnection } from "@solana/react-hooks";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { chainType } = useChainType();
    const { isConnected: connectedEvm } = useAccountEvm();
    const { disconnect: disconnectEvm } = useDisconnect();
    const { connected: connectedMvm, disconnect: disconnectMvm } = useWallet();
    const { connected: connectedSvm, disconnect: disconnectSvm } =
        useWalletConnection();
    const suiAccount = useCurrentAccount();
    const suiDappKit = useDAppKit();

    const prevChainType = usePrevious(chainType);

    // Disconnect from the previous chain when the chain type changes to prevent issues with stale connections
    useEffect(() => {
        if (prevChainType === chainType) return;

        if (connectedEvm) disconnectEvm();
        if (connectedMvm) disconnectMvm();
        if (connectedSvm) void disconnectSvm();
        if (suiAccount) void suiDappKit.disconnectWallet();
    }, [
        prevChainType,
        chainType,
        connectedEvm,
        disconnectEvm,
        connectedMvm,
        disconnectMvm,
        connectedSvm,
        disconnectSvm,
        suiAccount,
        suiDappKit,
    ]);

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
