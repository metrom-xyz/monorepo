"use client";

import { Button, Modal, Typography, X } from "@metrom-xyz/ui";
import { cloneElement, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AccountMenu, type Balance } from "../account-menu";
import {
    useBalance,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import type { ConnectButtonProps } from "..";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { lamportsToSolString } from "@solana/client";
import Image from "next/image";
import { trackUmamiEvent } from "@/src/utils/umami";
import { solanaNetworkToId } from "@/src/utils/chain";
import { useAccount } from "@/src/hooks/useAccount";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function ConnectButtonSvm({ customComponent }: ConnectButtonProps) {
    const t = useTranslations();

    const [open, setOpen] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);

    const { connectors, connected, connect, disconnect } =
        useWalletConnection();
    const { address } = useAccount();
    const rawBalance = useBalance(address);
    const solanaClient = useSolanaClient();

    const balance: Balance | undefined = useMemo(() => {
        if (rawBalance.lamports === null) return undefined;

        return {
            symbol: "SOL",
            amount: lamportsToSolString(rawBalance.lamports),
        };
    }, [rawBalance.lamports]);

    function handleModalOnOpen() {
        setOpen(true);
    }

    function handleModalOnClose() {
        setOpen(false);
    }

    async function handleConnect(connectorId: string) {
        try {
            await connect(connectorId, { autoConnect: true });
            setOpen(false);
        } catch (error) {
            console.error(`Could not connect: ${error}`);
        }
    }

    async function handleDisconnect() {
        try {
            await disconnect();
            setOpen(false);
        } catch (error) {
            console.error(`Could not disconnect: ${error}`);
        }
    }

    function handleAccountMenuOpen() {
        setAccountMenu(true);
        trackUmamiEvent("open-sidebar");
    }

    function handleAccountMenuClose() {
        setAccountMenu(false);
    }

    return (
        <div className={commonStyles.root}>
            <div className={commonStyles.wrapper}>
                {connected && address ? (
                    <>
                        <AccountMenu
                            account={address}
                            chainId={solanaNetworkToId(
                                solanaClient.config.cluster,
                            )}
                            open={accountMenu}
                            balance={balance}
                            onClose={handleAccountMenuClose}
                            onDisconnect={handleDisconnect}
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
                        {connectors.map((connector) => (
                            <button
                                key={connector.id}
                                disabled={!connector.isSupported()}
                                onClick={() => void handleConnect(connector.id)}
                                className={styles.walletButton}
                            >
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
                            </button>
                        ))}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
