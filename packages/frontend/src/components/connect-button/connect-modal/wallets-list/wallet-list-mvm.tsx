"use client";

import {
    groupAndSortWallets,
    isInstallRequired,
    useWallet,
    WalletItem,
} from "@aptos-labs/wallet-adapter-react";
import { Typography } from "@metrom-xyz/ui";
import { SpinnerIcon } from "@/src/assets/spinner-icon";

import styles from "./styles.module.css";

interface WalletListMvmProps {
    onConnect: () => void;
}

export function WalletListMvm({ onConnect }: WalletListMvmProps) {
    const { wallets = [], notDetectedWallets = [], isLoading } = useWallet();

    const { availableWallets, installableWallets } = groupAndSortWallets([
        ...wallets,
        ...notDetectedWallets,
    ]);

    return (
        <>
            {[...availableWallets, ...installableWallets].map((wallet) => (
                <WalletItem
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={onConnect}
                    className={styles.walletItem}
                >
                    {isInstallRequired(wallet) ? (
                        <WalletItem.InstallLink className={styles.walletButton}>
                            <div className={styles.leftContent}>
                                <WalletItem.Icon
                                    className={styles.walletIcon}
                                />
                                <Typography weight="medium">
                                    {wallet.name}
                                </Typography>
                            </div>
                        </WalletItem.InstallLink>
                    ) : (
                        <WalletItem.ConnectButton
                            className={styles.walletButton}
                        >
                            <div className={styles.leftContent}>
                                <WalletItem.Icon
                                    className={styles.walletIcon}
                                />
                                <Typography weight="medium">
                                    {wallet.name}
                                </Typography>
                            </div>
                            {isLoading && (
                                <SpinnerIcon className={styles.spinnerIcon} />
                            )}
                        </WalletItem.ConnectButton>
                    )}
                </WalletItem>
            ))}
        </>
    );
}
