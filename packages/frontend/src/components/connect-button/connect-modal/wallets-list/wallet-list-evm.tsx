"use client";

import { Typography } from "@metrom-xyz/ui";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";
import { useAccountEffect, useConnect, useConnectors } from "wagmi";
import { SAFE } from "@/src/commons/env";
import { SAFE_CONNECTOR_ID } from "@/src/commons";
import { SafeLogo } from "@/src/assets/logos/safe";
import { EVM_WALLETS_IDS } from "@/src/context/rainbow-kit";
import { WalletIcon } from "@/src/components/wallet-icon";
import { useCallback } from "react";

import styles from "./styles.module.css";

interface WalletListEvmProps {
    onConnect: () => void;
}

export function WalletListEvm({ onConnect }: WalletListEvmProps) {
    useAccountEffect({
        onConnect({ isReconnected }) {
            if (!isReconnected) onConnect();
        },
    });

    if (SAFE) return <SafeWalletEntry />;

    return (
        <>
            {EVM_WALLETS_IDS.map((wallet) => (
                <WalletButton.Custom key={wallet} wallet={wallet}>
                    {({ ready, loading, connector, connect }) => {
                        return (
                            <button
                                disabled={!ready || loading}
                                onClick={connect}
                                className={styles.walletButton}
                            >
                                <div className={styles.leftContent}>
                                    <WalletIcon
                                        iconUrl={connector.iconUrl}
                                        name={connector.name}
                                    />
                                    <Typography weight="medium">
                                        {connector.name}
                                    </Typography>
                                </div>
                            </button>
                        );
                    }}
                </WalletButton.Custom>
            ))}
        </>
    );
}

function SafeWalletEntry() {
    const t = useTranslations();
    const connectors = useConnectors();
    const { connect } = useConnect();

    const safeConnector = connectors.find(
        (connector) => connector.id === SAFE_CONNECTOR_ID,
    );

    const handleOnConnect = useCallback(() => {
        if (!safeConnector) return;
        connect({ connector: safeConnector });
    }, [connect, safeConnector]);

    if (!safeConnector) return null;

    return (
        <button onClick={handleOnConnect} className={styles.walletButton}>
            <SafeLogo className={styles.walletIcon} />
            <Typography weight="medium">{t("wallets.safe")}</Typography>
        </button>
    );
}
