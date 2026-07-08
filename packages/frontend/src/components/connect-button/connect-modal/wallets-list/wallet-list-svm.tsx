"use client";

import { Typography } from "@metrom-xyz/ui";
import { useWalletConnection } from "@solana/react-hooks";
import Image from "next/image";
import { useCallback } from "react";

import styles from "./styles.module.css";

interface WalletListSvmProps {
    onConnect: () => void;
}

export function WalletListSvm({ onConnect }: WalletListSvmProps) {
    const { connectors, connect } = useWalletConnection();

    const getOnConnectHandler = useCallback(
        (connectorId: string) => {
            return async () => {
                try {
                    await connect(connectorId, { autoConnect: true });
                    onConnect();
                } catch (error) {
                    console.error(`Could not connect: ${error}`);
                }
            };
        },
        [connect, onConnect],
    );

    return (
        <>
            {connectors.map((connector) => (
                <button
                    key={connector.id}
                    disabled={!connector.isSupported()}
                    onClick={getOnConnectHandler(connector.id)}
                    className={styles.walletButton}
                >
                    <div className={styles.leftContent}>
                        {connector.icon && (
                            <Image
                                alt={connector.name}
                                src={connector.icon}
                                width={32}
                                height={32}
                            />
                        )}
                        <Typography weight="medium">
                            {connector.name}
                        </Typography>
                    </div>
                </button>
            ))}
        </>
    );
}
