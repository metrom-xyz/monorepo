"use client";

import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useConnectionEffect,
    useConnect,
    useConnectors,
    type Connector,
} from "wagmi";
import { SAFE } from "@/src/commons/env";
import { SAFE_CONNECTOR_ID } from "@/src/commons";
import { SafeLogo } from "@/src/assets/logos/safe";
import { EVM_CONNECTOR_IDS } from "@/src/context/evm-wallet-provider";
import { WalletIcon } from "@/src/components/wallet-icon";
import { useCallback, useEffect, useState } from "react";

import styles from "./styles.module.css";

// Connectors that don't rely on browser-injected detection are always ready.
const ALWAYS_READY_CONNECTOR_IDS = ["walletConnect", "baseAccount"];

const WALLET_ICON_URLS: Record<string, string> = {
    frame: "/wallet-icons/frame.png",
    metaMaskSDK: "/wallet-icons/metamask.png",
    baseAccount: "/wallet-icons/coinbase.png",
    walletConnect: "/wallet-icons/wallet-connect.png",
    injected: "/wallet-icons/injected.svg",
};

interface WalletListEvmProps {
    onConnect: () => void;
}

export function WalletListEvm({ onConnect }: WalletListEvmProps) {
    useConnectionEffect({
        onConnect({ isReconnected }) {
            if (!isReconnected) onConnect();
        },
    });

    const connectors = useConnectors();

    if (SAFE) return <SafeWalletEntry />;

    const orderedConnectors = EVM_CONNECTOR_IDS.map((id) =>
        connectors.find((connector) => connector.id === id),
    ).filter((connector) => !!connector);

    return orderedConnectors.map((connector) => (
        <WalletButton key={connector.id} connector={connector} />
    ));
}

function WalletButton({ connector }: { connector: Connector }) {
    const connect = useConnect();
    const [ready, setReady] = useState(
        ALWAYS_READY_CONNECTOR_IDS.includes(connector.id),
    );

    useEffect(() => {
        if (ALWAYS_READY_CONNECTOR_IDS.includes(connector.id)) return;

        let cancelled = false;
        connector.getProvider().then((provider) => {
            if (!cancelled) setReady(!!provider);
        });

        return () => {
            cancelled = true;
        };
    }, [connector]);

    const loading =
        connect.isPending && connect.variables.connector === connector;

    const handleConnect = useCallback(() => {
        connect.mutate({ connector });
    }, [connect, connector]);

    return (
        <button
            disabled={!ready || loading}
            onClick={handleConnect}
            className={styles.walletButton}
        >
            <div className={styles.leftContent}>
                <WalletIcon
                    iconUrl={WALLET_ICON_URLS[connector.id]}
                    name={connector.name}
                />
                <Typography weight="medium">{connector.name}</Typography>
            </div>
        </button>
    );
}

function SafeWalletEntry() {
    const t = useTranslations();
    const connectors = useConnectors();
    const connect = useConnect();

    const safeConnector = connectors.find(
        (connector) => connector.id === SAFE_CONNECTOR_ID,
    );

    const handleOnConnect = useCallback(() => {
        if (!safeConnector) return;
        connect.mutate({ connector: safeConnector });
    }, [connect, safeConnector]);

    if (!safeConnector) return null;

    return (
        <button onClick={handleOnConnect} className={styles.walletButton}>
            <SafeLogo className={styles.walletIcon} />
            <Typography weight="medium">{t("wallets.safe")}</Typography>
        </button>
    );
}
