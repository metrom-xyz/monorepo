"use client";

import { Button, Modal, Typography, X } from "@metrom-xyz/ui";
import { cloneElement, useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AccountMenu, type Balance } from "../account-menu";
import {
    useWallets,
    useDAppKit,
    useCurrentNetwork,
    useCurrentAccount,
    useCurrentClient,
    type UiWallet,
} from "@mysten/dapp-kit-react";
import { Avatar } from "../../avatar/avatar";
import { Account } from "../../account";
import type { ConnectButtonProps } from "..";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import Image from "next/image";
import { trackUmamiEvent } from "@/src/utils/umami";
import { useQuery } from "@tanstack/react-query";
import { suiNetworkToId } from "@/src/utils/chain";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

const SUI_UNIT = 1_000_000_000;

export function ConnectButtonSui({ customComponent }: ConnectButtonProps) {
    const [open, setOpen] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);

    const t = useTranslations();
    const dAppKit = useDAppKit();
    const account = useCurrentAccount();
    const wallets = useWallets();
    const network = useCurrentNetwork();
    const client = useCurrentClient();

    const address = account?.address;

    const { data: rawBalance } = useQuery({
        queryKey: ["sui-balance", address],
        queryFn: async () => {
            if (!address) return null;

            const response = await client.getBalance({ owner: address });
            return response.balance.balance;
        },
        enabled: !!address,
    });

    const balance: Balance | undefined = useMemo(() => {
        if (rawBalance === undefined || rawBalance === null) return undefined;
        return {
            symbol: "SUI",
            amount: Number(rawBalance) / SUI_UNIT,
        };
    }, [rawBalance]);

    function handleModalOnOpen() {
        setOpen(true);
    }

    function handleModalOnClose() {
        setOpen(false);
    }

    const getOnConnectHandler = useCallback(
        (wallet: UiWallet) => {
            return async () => {
                try {
                    await dAppKit.connectWallet({ wallet });
                    setOpen(false);
                } catch (error) {
                    console.error(`Could not connect: ${error}`);
                }
            };
        },
        [dAppKit],
    );

    const handleDisconnect = useCallback(async () => {
        try {
            await dAppKit.disconnectWallet();
        } catch (error) {
            console.error(`Could not disconnect: ${error}`);
        }
    }, [dAppKit]);

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
                {account && address ? (
                    <>
                        <AccountMenu
                            account={address}
                            chainId={suiNetworkToId(network)}
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
                        {wallets.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={getOnConnectHandler(wallet)}
                                className={styles.walletButton}
                            >
                                {wallet.icon && (
                                    <Image
                                        alt={wallet.name}
                                        src={wallet.icon}
                                        width={32}
                                        height={32}
                                    />
                                )}
                                <Typography weight="medium">
                                    {wallet.name}
                                </Typography>
                            </button>
                        ))}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
