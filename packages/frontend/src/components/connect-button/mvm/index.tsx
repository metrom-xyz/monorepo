import {
    groupAndSortWallets,
    isInstallRequired,
    useWallet,
    WalletItem,
} from "@aptos-labs/wallet-adapter-react";
import { Button, Modal, Typography } from "@metrom-xyz/ui";
import { useMemo, useState } from "react";
import { AccountMenu, type Balance } from "../account-menu";
import type { Address } from "viem";
import { trackFathomEvent } from "@/src/utils/fathom";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import { useTranslations } from "next-intl";
import { useAptBalance } from "@aptos-labs/react";
import { formatUnits } from "viem";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";
import { formatApt } from "@aptos-labs/js-pro";

export function ConnectButtonMvm() {
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
        if (!aptBalance) return undefined;

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
        <div>
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
                        className={commonStyles.walletWrapper}
                        onClick={handleAccountMenuOpen}
                    >
                        <div className={commonStyles.account}>
                            <Avatar address={address} height={28} width={28} />
                            <Account
                                address={address}
                                variant="full"
                                className={commonStyles.displayName}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <Button
                    size="sm"
                    onClick={handleModalOnOpen}
                    className={{
                        root: commonStyles.connectButton,
                    }}
                >
                    {t("navigation.connect")}
                </Button>
            )}
            <Modal onDismiss={handleModalOnClose} open={open}>
                <div className={styles.modal}>
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
                                        <WalletItem.Icon
                                            className={styles.walletIcon}
                                        />
                                        <Typography size="sm" weight="medium">
                                            {wallet.name}
                                        </Typography>
                                    </WalletItem.InstallLink>
                                ) : (
                                    <WalletItem.ConnectButton
                                        className={styles.walletButton}
                                    >
                                        <WalletItem.Icon
                                            className={styles.walletIcon}
                                        />
                                        <Typography size="sm" weight="medium">
                                            {wallet.name}
                                        </Typography>
                                    </WalletItem.ConnectButton>
                                )}
                            </WalletItem>
                        ),
                    )}
                </div>
            </Modal>
        </div>
    );
}
