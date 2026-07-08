"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { useAccount as useAccountEvm, useDisconnect } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useChainType } from "@/src/context/chain-type";
import { useWalletConnection } from "@solana/react-hooks";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { ChainType } from "@metrom-xyz/sdk";
import { useAutoConnect } from "@/src/hooks/use-auto-connect";
import { useSafeAutoConnect } from "@/src/hooks/useSafeAutoConnect";

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
    const autoConnect = useAutoConnect();

    useSafeAutoConnect();

    const prevChainTypeRef = useRef<ChainType>(undefined);

    // When the chain type changes, disconnect the wallets of every other
    // ecosystem to prevent issues with stale connections, then try to
    // silently reconnect the wallet last used on the new one.
    //
    // The connection states and disconnect functions are deliberately not
    // dependencies: any mid-switch re-render they caused would run the cleanup
    // and cancel the in-flight switch before the silent reconnect happens.
    useEffect(() => {
        const prevChainType = prevChainTypeRef.current;
        prevChainTypeRef.current = chainType;

        if (prevChainType === undefined || prevChainType === chainType) return;

        let cancelled = false;

        const switchWallets = async () => {
            const disconnections: Promise<unknown>[] = [];

            if (chainType !== ChainType.Evm && connectedEvm)
                disconnections.push(
                    Promise.resolve(disconnectEvm()).catch((error: unknown) =>
                        console.warn(
                            `Could not disconnect EVM wallet: ${error}`,
                        ),
                    ),
                );
            if (chainType !== ChainType.Aptos && connectedMvm)
                disconnections.push(
                    Promise.resolve(disconnectMvm()).catch((error: unknown) =>
                        console.warn(
                            `Could not disconnect Aptos wallet: ${error}`,
                        ),
                    ),
                );
            if (chainType !== ChainType.Svm && connectedSvm)
                disconnections.push(
                    disconnectSvm().catch((error: unknown) =>
                        console.warn(
                            `Could not disconnect Solana wallet: ${error}`,
                        ),
                    ),
                );
            if (chainType !== ChainType.Sui && suiAccount)
                disconnections.push(
                    suiDappKit
                        .disconnectWallet()
                        .catch((error: unknown) =>
                            console.warn(
                                `Could not disconnect Sui wallet: ${error}`,
                            ),
                        ),
                );

            await Promise.all(disconnections);
            if (cancelled) return;

            await autoConnect(chainType);
        };

        void switchWallets();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainType]);

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
