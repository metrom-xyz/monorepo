"use client";

import { Typography } from "@metrom-xyz/ui";
import { useDAppKit, useWallets, type UiWallet } from "@mysten/dapp-kit-react";
import { useCallback, useState } from "react";
import Image from "next/image";
import { SpinnerIcon } from "@/src/assets/spinner-icon";

import styles from "./styles.module.css";

interface WalletListSuiProps {
    onConnect: () => void;
}

export function WalletListSui({ onConnect }: WalletListSuiProps) {
    const [connecting, setConnecting] = useState<string | undefined>();

    const dAppKit = useDAppKit();
    const wallets = useWallets();

    const getOnConnectHandler = useCallback(
        (wallet: UiWallet) => {
            return async () => {
                try {
                    setConnecting(wallet.name);
                    await dAppKit.connectWallet({ wallet });
                    onConnect();
                } catch (error) {
                    console.error(`Could not connect: ${error}`);
                } finally {
                    setConnecting(undefined);
                }
            };
        },
        [dAppKit, onConnect],
    );

    return (
        <>
            {wallets.map((wallet) => (
                <button
                    key={wallet.name}
                    disabled={!!connecting}
                    onClick={getOnConnectHandler(wallet)}
                    className={styles.walletButton}
                >
                    <div className={styles.leftContent}>
                        {wallet.icon && (
                            <Image
                                alt={wallet.name}
                                src={wallet.icon}
                                width={32}
                                height={32}
                            />
                        )}
                        <Typography weight="medium">{wallet.name}</Typography>
                    </div>
                    {connecting === wallet.name && (
                        <SpinnerIcon className={styles.spinnerIcon} />
                    )}
                </button>
            ))}
        </>
    );
}
