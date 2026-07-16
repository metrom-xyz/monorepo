"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAccount as useAccountEvm, useDisconnect } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/context/chain-type";
import { Nav } from "./nav";

import styles from "./styles.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { chainType } = useChainType();
    const { isConnected: connectedEvm } = useAccountEvm();
    const { disconnect: disconnectEvm } = useDisconnect();
    const { connected: connectedMvm, disconnect: disconnectMvm } = useWallet();

    const prevChainTypeRef = useRef<ChainType>(undefined);

    // When the chain type changes, disconnect the wallet of the other
    // ecosystem to prevent issues with stale connections. Reconnection is
    // handled by the ecosystem's own machinery: the Safe connector effect in
    // ConnectButtonEvm and the Aptos adapter's autoConnect.
    //
    // The connection states and disconnect functions are deliberately not
    // dependencies: any mid-switch re-render they caused would run the
    // effect again and cancel the in-flight switch.
    useEffect(() => {
        const prevChainType = prevChainTypeRef.current;
        prevChainTypeRef.current = chainType;

        if (prevChainType === undefined || prevChainType === chainType) return;

        if (chainType !== ChainType.Evm && connectedEvm) {
            try {
                disconnectEvm();
            } catch (error) {
                console.warn(`Could not disconnect EVM wallet: ${error}`);
            }
        }
        if (chainType !== ChainType.Aptos && connectedMvm) {
            Promise.resolve(disconnectMvm()).catch((error: unknown) => {
                console.warn(`Could not disconnect Aptos wallet: ${error}`);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainType]);

    return (
        <div className={styles.layout}>
            <Nav />
            <div className={styles.main}>{children}</div>
        </div>
    );
}
