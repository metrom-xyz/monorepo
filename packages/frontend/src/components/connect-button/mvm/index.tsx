import {
    groupAndSortWallets,
    isInstallRequired,
    useWallet,
    WalletItem,
} from "@aptos-labs/wallet-adapter-react";
import { Button, Modal, Typography, X } from "@metrom-xyz/ui";
import { cloneElement, useMemo, useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import type { Address } from "viem";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { useTranslations } from "next-intl";
import { useAptBalance } from "@aptos-labs/react";
import { formatApt } from "@aptos-labs/js-pro";
import type { ConnectButtonProps } from "..";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function ConnectButtonMvm({ customComponent }: ConnectButtonProps) {
    const t = useTranslations();

    const [open, setOpen] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);

    const {
        wallets = [],
        notDetectedWallets = [],
        connected,
        disconnect,
        account,
        network,
    } = useWallet();

    const { data: aptBalance } = useAptBalance({
        address: account?.address,
    });

    const balance: Balance | undefined = useMemo(() => {
        if (aptBalance === undefined) return undefined;

        return {
            symbol: "APT",
            amount: Number(formatApt(aptBalance)),
        };
    }, [aptBalance]);

    function handleModalOnOpen() {
        setOpen(true);
    }

    function handleModalOnClose() {
        setOpen(false);
    }

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackFathomEvent("OPEN_SIDEBAR");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
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
                    <>
                        <AccountMenu
                            account={address}
                            chainId={network.chainId}
                            open={accountMenu}
                            balance={balance}
                            onClose={handleAccountMenuClose}
                            onDisconnect={disconnect}
                        />
                        <div
                            onClick={handleAccountMenuOpen}
                            className={commonStyles.walletWrapper}
                        >
                            <div className={commonStyles.account}>
                                <Avatar
                                    address={address}
                                    height={20}
                                    width={20}
                                />
                                <Account
                                    address={address}
                                    className={commonStyles.displayName}
                                />
                            </div>
                        </div>
                    </>
                ) : customComponent ? (
                    cloneElement(customComponent, {
                        onClick: handleModalOnOpen,
                    })
                ) : (
                    <Button
                        onClick={handleModalOnOpen}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        className={{
                            root: commonStyles.connectButton,
                        }}
                    >
                        {t("navigation.connect")}
                    </Button>
                )}
                <Modal onDismiss={handleModalOnClose} open={open}>
                    <div className={styles.modal}>
                        <div className={styles.title}>
                            <Typography weight="medium">
                                {t("wallets.title")}
                            </Typography>
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
