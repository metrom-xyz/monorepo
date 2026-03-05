import {
    groupAndSortWallets,
    isInstallRequired,
    useWallet,
    WalletItem,
} from "@aptos-labs/wallet-adapter-react";
import { Button, Modal, Typography, X } from "@metrom-xyz/ui";
import { useState } from "react";
import type { Address } from "viem";
import commonStyles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Account } from "@/components/account";

import styles from "./styles.module.css";

export function ConnectButtonMvm() {
    const t = useTranslations("connectButton");
    const [open, setOpen] = useState(false);

    const {
        wallets = [],
        notDetectedWallets = [],
        connected,
        // disconnect,
        account,
        network,
    } = useWallet();

    function handleModalOnOpen() {
        setOpen(true);
    }

    function handleModalOnClose() {
        setOpen(false);
    }

    const { availableWallets, installableWallets } = groupAndSortWallets([
        ...wallets,
        ...notDetectedWallets,
    ]);

    const address = account?.address.toString() as Address | undefined;

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                {connected && network && address ? (
                    <div className={styles.walletWrapper}>
                        <div className={styles.account}>
                            <Account
                                address={address as Address}
                                className={styles.displayName}
                            />
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={handleModalOnOpen}
                        iconPlacement="right"
                        className={{
                            root: commonStyles.connectButton,
                        }}
                    >
                        {t("connect")}
                    </Button>
                )}
                <Modal onDismiss={handleModalOnClose} open={open}>
                    <div className={styles.modal}>
                        <div className={styles.title}>
                            <Typography weight="medium">Connect</Typography>
                            <X
                                onClick={handleModalOnClose}
                                className={styles.closeIcon}
                            />
                        </div>
                        {[...availableWallets, ...installableWallets].map(
                            (wallet) => (
                                <WalletItem
                                    key={wallet.name}
                                    wallet={wallet}
                                    onConnect={handleModalOnClose}
                                    className={styles.walletItem}
                                >
                                    {isInstallRequired(wallet) ? (
                                        <WalletItem.InstallLink
                                            className={styles.walletButton}
                                        >
                                            <div className={styles.leftContent}>
                                                <WalletItem.Icon
                                                    className={
                                                        styles.walletIcon
                                                    }
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
                                                    className={
                                                        styles.walletIcon
                                                    }
                                                />
                                                <Typography weight="medium">
                                                    {wallet.name}
                                                </Typography>
                                            </div>
                                        </WalletItem.ConnectButton>
                                    )}
                                </WalletItem>
                            ),
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
